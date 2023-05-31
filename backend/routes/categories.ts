import express from 'express';
import Category from '../models/Category';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.send(categories);
  } catch (e) {
    return next(e);
  }
});

categoriesRouter.get('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const result = await Category.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).send({ error: 'area not found!' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

categoriesRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const result = await Category.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ error: 'area not found!' });
    }
    await Category.updateOne({ _id: id }, { name: edit.name });
    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

categoriesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const Data = new Category({
      name: req.body.name,
    });
    await Data.save();
    return res.send(Data);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

categoriesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const category = await Category.findOne({ _id });
    if (!category) {
      return res.status(404).send({ error: 'Сategory is connected to other entities! Deletion canceled' });
    }
    const result = await Category.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default categoriesRouter;
