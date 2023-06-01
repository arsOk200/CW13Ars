import express from 'express';
import Family from '../models/Family';
import auth from '../middleware/auth';
import User from '../models/User';
import mongoose from 'mongoose';
const familyRouter = express.Router();

familyRouter.get('/', auth, async (req, res, next) => {
  try {
    const result = await Family.find().populate('owner users');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id }).populate('users', 'owner');
    if (!result) {
      return res.status(404).send({ name: 'not found' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found' });
    }
    if (!result) {
      return res.status(404).send({ error: 'not found!' });
    }
    if (user.role === 'admin') {
      await Family.updateOne({ _id: id }, { name: edit.name });
      return res.send(result);
    } else if (user._id.toString() !== result.owner._id.toString()) {
      return res.status(403).send({ message: 'You are not an owner' });
    }
    await Family.updateOne({ _id: id }, { name: edit.name });
    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

familyRouter.patch('/:id/toggleAdd', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found' });
    }
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (result) {
      const update = await Family.updateOne({ _id: id }, { $push: { users: user } });
      return res.send(update);
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

familyRouter.post('/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const Data = new Family({
      name: req.body.name,
      owner: user._id.toString(),
    });
    await Data.save();
    return res.send({ message: 'Created' });
  } catch (e) {
    return next(e);
  }
});

familyRouter.patch('/:id/toggleDelete', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).send({ name: 'not found' });

    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (!result) return res.status(404).send({ name: 'not found' });

    if (user._id !== result.owner) {
      const update = await Family.findOne({ _id: id, users: { $elemMatch: { _id: user._id } } });
      if (!update) {
        return res.status(403);
      }
      await Family.updateOne({ _id: id }, { $pull: { users: { _id: user._id } } });
      return res.send(update);
    }
  } catch (e) {
    return next(e);
  }
});

familyRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found' });
    }
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (result) {
      if (user._id.toString() === result.owner._id.toString()) {
        const update = await Family.deleteOne({ _id: id });
        return res.send(update);
      } else if (user.role === 'admin') {
        const update = await Family.deleteOne({ _id: id });
        return res.send(update);
      } else {
        return res.status(403).send({ message: 'You are not an owner' });
      }
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

export default familyRouter;
