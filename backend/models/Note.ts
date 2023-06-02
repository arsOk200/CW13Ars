import mongoose, { Types } from 'mongoose';
import User from './User';
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: (value: Types.ObjectId) => User.findById(value),
      message: 'user is not found !',
    },
  },
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;
