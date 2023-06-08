import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { CartList } from '../../types';

export const addToCart = createAsyncThunk<void, string>('cart/addToCart', async (id) => {
  await axiosApi.patch('/cart/' + id + '/toggleCart');
});

export const fetchCart = createAsyncThunk<CartList>('cart/fetchCart', async () => {
  const response = await axiosApi.get<CartList | null>('/cart');
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

export const deleteFromCart = createAsyncThunk<void, string>('cart/deleteOne', async (id) => {
  await axiosApi.patch('/cart/' + id + '/toggleDelete');
});
