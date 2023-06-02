import express from 'express';
import Note from '../models/Note';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import User from '../models/User';

const notesRouter = express.Router();

notesRouter.get('/', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(403);
    }
    const notes = await Note.find({ user: user._id });
    return res.send(notes);
  } catch (e) {
    return next(e);
  }
});

notesRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const result = await Note.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).send({ error: 'area not found!' });
    }
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

notesRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const result = await Note.findOne({ _id: id });
    if (!result) {
      return res.status(404).send({ error: 'not found!' });
    }
    await Note.updateOne({ _id: id }, { name: edit.name });
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
    const Data = new Note({
      name: req.body.name,
      text: req.body.name,
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

notesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
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
