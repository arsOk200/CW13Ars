import auth from '../middleware/auth';
import Product from '../models/Product';
import User from '../models/User';

import express from 'express';
import Cart from '../models/Cart';

const cartRouter = express.Router();

cartRouter.patch('/:id/toggleCart/', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(400);
    }
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const result = await Cart.findOne({ user: user._id });
    if (!result) {
      const Data = await Cart.create({ user: user._id, cart: { cart: product } });
      await Data.save();
      return res.send(Data);
    } else if (result) {
      const update = await Cart.updateOne({ user: user._id }, { $push: { cart: product } });
      return res.send(update);
    } else {
      return res.status(404).send({ message: 'not found' });
    }
  } catch (e) {
    return next(e);
  }
});

cartRouter.patch('/:id/toggleDelete/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found 1' });
    }
    const id = req.params.id as string;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404);
    }
    const result = await Cart.findOne({ user: user._id });
    if (!result) {
      return res.status(404);
    }
    const update = await Cart.findOne({ _id: result._id, cart: { $elemMatch: { _id: product._id } } });
    if (!update) {
      return res.status(403);
    }
    await Cart.updateOne({ _id: id }, { $pull: { cart: { _id: product._id } } });
    return res.send(update);
  } catch (e) {
    return next(e);
  }
});

export default cartRouter;
