import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';

const app = express();
const port = 8001;
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/user', usersRouter);

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
