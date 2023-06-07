import express from 'express';
import Note from '../models/Note';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import User from '../models/User';

const notesRouter = express.Router();

notesRouter.get('/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const notes = await Note.find({ user: user._id }).sort({ _id: -1 });
    return res.send(notes);
  } catch (e) {
    return next(e);
  }
});

notesRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const result = await Note.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).send({ error: 'note not found!' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

notesRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    text: req.body.text,
    title: req.body.title,
  };
  try {
    const id = req.params.id as string;
    const result = await Note.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ error: 'not found!' });
    }
    await Note.updateOne({ _id: id }, { text: edit.text, title: edit.title });
    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

notesRouter.post('/', auth, async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const Data = new Note({
      user: user._id.toString(),
      title: req.body.title,
      text: req.body.text,
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

notesRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const note = await Note.findOne({ _id });
    if (!note) {
      return res.status(404);
    }
    const result = await Note.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default notesRouter;
