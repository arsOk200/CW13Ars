import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;
  try {
    await db.dropCollection('users');
    await db.dropCollection('carts');
    await db.dropCollection('categories');
    await db.dropCollection('families');
    await db.dropCollection('notes');
    await db.dropCollection('products');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }
  await User.create(
    {
      username: 'First',
      password: 'First',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'First',
      image: 'fixtures/avatar1.jpg',
    },
    {
      username: 'admin',
      password: '12345',
      token: crypto.randomUUID(),
      role: 'admin',
      displayName: 'admin',
      image: 'fixtures/admin.webp',
    },
    {
      username: 'Second',
      password: 'Second',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'Second',
      image: 'fixtures/avatar2.jpeg',
    },
    {
      username: 'Third',
      password: 'Third',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'Third',
      image: 'fixtures/avatar3.jpg',
    },
    {
      username: 'Four',
      password: 'Four',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'Four',
      image: 'fixtures/avatar4.png',
    },
    {
      username: 'Five',
      password: 'Five',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'Five',
      image: 'fixtures/avatar5.jpeg',
    },
  );

  const [category1, category2, category3, category4, category5, category6, category7, category8] =
    await Category.create(
      {
        name: 'Bread',
      },
      {
        name: 'Milk',
      },
      {
        name: 'Alcohol',
      },
      {
        name: 'corn',
      },
      {
        name: 'flowers',
      },
      {
        name: 'chemistry',
      },
      {
        name: 'fast-food',
      },
      {
        name: 'meat',
      },
    );

  await Product.create(
    {
      category: category2._id,
      name: 'Milk 1l',
      price: 120,
      description: '1L Milk 2.5%',
      image: 'fixtures/Milk.jpg',
    },
    {
      category: category1._id,
      name: 'Bread',
      price: 150,
      description: 'White bread 500g',
      image: 'fixtures/bread.jpeg',
    },
    {
      category: category1._id,
      name: 'Bun',
      price: 90,
      description: 'Bun without sugar 100g',
      image: 'fixtures/Bulochka.jpg',
    },
    {
      category: category7._id,
      name: 'Lays Chips',
      price: 150,
      description: 'Lays 150g',
      image: 'fixtures/chips.webp',
    },
    {
      category: category6._id,
      name: 'Cream For hand',
      price: 300,
      description: 'Cream 90g',
      image: 'fixtures/creamForHand.webp',
    },
    {
      category: category3._id,
      name: 'Alcoholic Drink with Cherry',
      price: 250,
      description: 'Drink 500g',
      image: 'fixtures/drink.jpg',
    },
    {
      category: category5._id,
      name: 'Flowers',
      price: 400,
      description: '101 Flowers',
      image: 'fixtures/flowers.png',
    },
    {
      category: category8._id,
      name: 'Meat for stake',
      price: 700,
      description: 'Meat 1kg',
      image: 'fixtures/meat.jpg',
    },
    {
      category: category3._id,
      name: 'Bear',
      price: 300,
      description: 'Bear 11% 1l',
      image: 'fixtures/pivo.jpg',
    },
    {
      category: category4._id,
      name: 'Rice',
      price: 120,
      description: 'Rice 1kg Tashkent',
      image: 'fixtures/rice.jpg',
    },
    {
      category: category6._id,
      name: 'Shampoo',
      price: 400,
      description: '1l Shampoo Head&Shoulders',
      image: 'fixtures/shampoo.webp',
    },
    {
      category: category3._id,
      name: 'Vodka',
      price: 500,
      description: '1l Vodka 40%',
      image: 'fixtures/Vodka.webp',
    },
  );

  await db.close();
};

void run();
