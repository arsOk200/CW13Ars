import auth from '../middleware/auth';
import Product from '../models/Product';
import User from '../models/User';
import express from 'express';
import Cart from '../models/Cart';
const CartRouter = express.Router();

CartRouter.get('/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const result = await Cart.aggregate([
      { $match: { user: { $eq: user._id } } },
      { $lookup: { from: 'products', localField: 'cart._id', foreignField: '_id', as: 'cart' } },
    ]);
    return res.send(result[0]);
  } catch (e) {
    return next(e);
  }
});

CartRouter.patch('/:id/toggleCart/', auth, async (req, res, next) => {
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
      await Cart.updateOne({ user: user._id }, { $push: { cart: product } });
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

CartRouter.patch('/:id/toggleDelete/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).send({ name: 'not found 1' });
    }
    const id = req.params.id as string;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ name: 'not found 2' });
    }
    const result = await Cart.findOne({ user: user._id });
    if (!result) {
      return res.status(404).send({ name: 'not found 3' });
    }
    const deleteResult = await Cart.updateOne({ user: user._id }, { $pull: { cart: { _id: product._id } } });
    return res.send(deleteResult);
  } catch (e) {
    return next(e);
  }
});

export default CartRouter;
