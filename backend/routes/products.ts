import express from 'express';
import { imagesUpload } from '../multer';
import Product from '../models/Product';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Category from '../models/Category';
import { promises as fs } from 'fs';
import path from 'path';
import config from '../config';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.cat) {
      const category = await Category.findOne({ name: req.query.cat });
      if (!category) {
        return res.status(404).send({ error: ' not found!' });
      }
      const products = await Product.find({ category: category._id.toString() }).populate('category');
      return res.send(products);
    } else {
      const products = await Product.find().populate('category');
      return res.send(products);
    }
  } catch (e) {
    return next(e);
  }
});

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const result = await Product.findById(req.params.id);
    if (!result) {
      return res.sendStatus(404);
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

productsRouter.post('/', auth, permit('admin'), imagesUpload.single('image'), async (req, res, next) => {
  try {
    const product = await Product.create({
      category: req.body.category,
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.filename : null,
    });
    return res.send(product);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

productsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }
    if (product.image) {
      await fs.unlink(path.join(config.publicPath, `/images/${product.image}`));
    }
    const result = await Product.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default productsRouter;
