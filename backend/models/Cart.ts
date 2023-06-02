import mongoose, { Types } from 'mongoose';
import User from './User';
import Product from './Product';
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => User.findById(value),
      message: 'user is not found !',
    },
  },
  cart: {
    type: [
      {
        products: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
          validate: {
            validator: (value: Types.ObjectId) => Product.findById(value),
            message: 'product is not found !',
          },
        },
      },
    ],
  },
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
