import express from 'express';
import Family from '../models/Family';
import auth from '../middleware/auth';
import User from '../models/User';
import mongoose, { Types } from 'mongoose';
import Product from '../models/Product';
const familyRouter = express.Router();

familyRouter.get('/', auth, async (req, res, next) => {
  try {
    const result = await Family.find().populate('owner users');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.get('/find/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const result = await Family.aggregate([
      { $lookup: { from: 'users', localField: 'users._id', foreignField: '_id', as: 'users' } },
      {
        $match: { users: { $elemMatch: { _id: new Types.ObjectId(id) } } },
      },
    ]);
    if (!result) {
      return res.status(404).send({ name: 'not found' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

familyRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const result = await Family.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'owner' } },
      { $lookup: { from: 'users', localField: 'users._id', foreignField: '_id', as: 'users' } },
      { $lookup: { from: 'products', localField: 'cart._id', foreignField: '_id', as: 'cart' } },
    ]);
    if (!result) {
      return res.status(404).send({ name: 'not found' });
    }
    const family = result[0];
    return res.send(family);
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

familyRouter.patch('/:id/toggleAddTo', auth, async (req, res, next) => {
  try {
    const product = req.query.product;
    if (!product) {
      return res.status(400);
    }
    const ProductToAdd = await Product.findOne({ _id: product });
    if (!ProductToAdd) {
      return res.status(400);
    }
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found 1' });
    }
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ name: 'not found 2' });
    }
    if (result) {
      const update = await Family.updateOne({ _id: id }, { $push: { cart: ProductToAdd } });
      return res.send(update);
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

familyRouter.patch('/:id/toggleDeleteFromCart', auth, async (req, res, next) => {
  try {
    const product = req.query.product;
    if (!product) {
      return res.status(400);
    }
    const ProductToAdd = await Product.findOne({ _id: product });
    if (!ProductToAdd) {
      return res.status(404);
    }
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found 1' });
    }
    const id = req.params.id as string;
    const result = await Family.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ name: 'not found 2' });
    }
    if (user._id !== result.owner) {
      const update = await Family.findOne({ _id: id, users: { $elemMatch: { _id: user._id } } });
      if (!update) {
        return res.status(403);
      }
      await Family.updateOne({ _id: id }, { $pull: { cart: { _id: ProductToAdd._id } } });
      return res.send(update);
    } else if (user._id === result.owner) {
      await Family.updateOne({ _id: id }, { $pull: { cart: { _id: ProductToAdd._id } } });
    }
  } catch (e) {
    return next(e);
  }
});

familyRouter.patch('/:id/toggleDelete', auth, async (req, res, next) => {
  try {
    const userForDelete = req.query.user;
    const id = req.params.id as string;
    if (!userForDelete) {
      return res.status(400);
    }
    const user = await User.findById(userForDelete);
    if (!user) {
      return res.status(404).send({ name: 'user not found' });
    }
    const result = await Family.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ name: 'family not found ' });
    }
    if (user._id !== result.owner) {
      const update = await Family.findOne({ _id: id, users: { $elemMatch: { _id: user._id } } });
      if (!update) {
        return res.status(403).send({ name: 'You are not in family' });
      }
      await Family.updateOne({ _id: id }, { $pull: { users: { _id: user._id } } });
      return res.send(update);
    } else if (user._id === result.owner) {
      await Family.updateOne({ _id: id }, { $pull: { users: { _id: user._id } } });
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
