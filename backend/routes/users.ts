import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
// import {OAuth2Client} from "google-auth-library";
// import config from "../config";
// import * as crypto from "crypto";
import { imagesUpload } from '../multer';
import auth from '../middleware/auth';
import path from 'path';
import axios from 'axios';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { parse } from 'url';
import { randomUUID } from 'crypto';
import config from '../config';

export const urlImageUpload = async (url: string, path: string) => {
  const destDir = join(config.publicPath, path);
  await fs.mkdir(destDir, { recursive: true });
  const ext = extname(<string>parse(url).pathname);
  const filename = join(path, randomUUID() + ext);
  const fileResponse = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  await fs.writeFile(join(config.publicPath, filename), fileResponse.data);

  return filename;
};

const UsersRouter = express.Router();
// const client = new OAuth2Client(config.google.clientId);

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
  let page = parseInt(req.query.page as string);
  let perPage = parseInt(req.query.perPage as string);

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const count = await User.count();
    let pages = Math.ceil(count / perPage);

    if (pages === 0) pages = 1;
    if (page > pages) page = pages;

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.send({ users, page, pages, count, perPage });
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

// UsersRouter.post("/google", async (req, res, next) => {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: req.body.credential,
//       audience: config.google.clientId,
//     });
//     const payload = ticket.getPayload();
//     if (!payload) {
//       return res.status(400).send({ error: "Google login error!" });
//     }
//     const email = payload["email"];
//     const googleId = payload["sub"];
//     const displayName = payload["name"];
//     const avatar = payload["picture"];
//     if (!email) {
//       return res.status(400).send({ error: "Not enough user data to continue" });
//     }
//     let user = await User.findOne({ googleId: googleId });
//     if (!user) {
//       const randomImageName = `${crypto.randomUUID()}.png`;
//       await downloadImage(avatar, `./public/images/${randomImageName}`)
//       user = new User({
//         username:email,
//         password: crypto.randomUUID(),
//         googleId: googleId,
//         displayName:displayName,
//         image:avatar,
//       })
//     }
//     user.generateToken();
//     await user.save();
//     return res.send({ message: "Login with Google successful!", user });
//   } catch (e) {
//     return next(e);
//   }
// });

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
