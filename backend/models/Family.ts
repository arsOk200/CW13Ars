import mongoose, { Types } from 'mongoose';
import User from './User';
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  users: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          validate: {
            validator: (value: Types.ObjectId) => User.findById(value),
            message: 'user is not found !',
          },
        },
      },
    ],
  },
});

const Family = mongoose.model('Family', FamilySchema);
export default Family;
