import express from 'express';
import Family from '../models/Family';
import auth from '../middleware/auth';
import User from '../models/User';
const familyRouter = express.Router();

familyRouter.get('/', auth, async (req, res, next) => {
  try {
    const result = await Family.find();
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ name: 'not found' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.patch('/:id/toggleAdd', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ _id: token });
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
    const user = await User.findOne({ _id: token });
    if (!user) return res.status(403);
    const Data = new Family({
      name: req.body.name,
      owner: user && user._id,
    });
    await Data.save();
  } catch (e) {
    return next(e);
  }
});

familyRouter.patch('/:id/toggleDelete', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ _id: token });
    if (!user) return res.status(404).send({ name: 'not found' });

    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (result) {
      if (user._id === result.owner) {
        const update = await Family.updateOne({ _id: id }, { $pull: { users: user } });
        return res.send(update);
      } else if (user._id !== result.owner) {
        const update = await Family.findOne({ _id: id, users: { $elemMatch: user._id } });
        if (!update) return res.status(403);
        await Family.updateOne({ _id: id }, { $pull: { users: user } });
      }
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

familyRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ _id: token });
    if (!user) return res.status(404).send({ name: 'not found' });
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (result) {
      if (user._id === result.owner) {
        const update = await Family.deleteOne({ _id: id });
        return res.send(update);
      } else {
        return res.status(403);
      }
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

export default familyRouter;
