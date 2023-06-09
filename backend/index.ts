import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import familyRouter from './routes/family';
import notesRouter from './routes/notes';
import CartRouter from './routes/carts';

const app = express();
const port = 8000;
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/category', categoriesRouter);
app.use('/products', productsRouter);
app.use('/family', familyRouter);
app.use('/note', notesRouter);
app.use('/cart', CartRouter);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
  process.on('exit', () => {
    void mongoose.disconnect();
  });
};

run().catch(console.error);
