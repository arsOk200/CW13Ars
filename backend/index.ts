import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8001;
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

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
