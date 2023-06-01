import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { imagesUpload } from '../multer';
import auth from '../middleware/auth';
import path from 'path';
import { promises as fs } from 'fs';
import config from '../config';

const UsersRouter = express.Router();

UsersRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
      image: req.file ? req.file.filename : null,
    });
    user.generateToken();
    await user.save();
    return res.send({ message: 'Registered successfully! ', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

UsersRouter.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    return next(e);
  }
});

UsersRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    return res.send(user);
  } catch (e) {
    return next(e);
  }
});

UsersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = { message: 'ok' };
    if (!token) {
      return res.send(success);
    }
    const user = await User.findOne({ token });
    if (!user) {
      return res.send(success);
    }
    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

UsersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }
  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }
  try {
    user.generateToken();
    await user.save();
    return res.send({ message: 'Username and password correct!', user });
  } catch (e) {
    return next(e);
  }
});

UsersRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.send({ error: 'User is not found!' });
    }
    if (user.image) {
      await fs.unlink(path.join(config.publicPath, `${user.image}`));
    }
    const deletedUser = await User.deleteOne({ _id: req.params.id });
    return res.send(deletedUser);
  } catch (e) {
    return next(e);
  }
});

export default UsersRouter;
