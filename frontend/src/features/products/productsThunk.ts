import { ProductList, ProductMutation, GlobalError, ValidationError } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../app/store';
import { setProduct } from './productsSlice';

export const fetchProduct = createAsyncThunk<ProductList[], string | undefined>('product/fetch_product', async (id) => {
  if (!id) {
    const response = await axiosApi.get<ProductList[]>('/products');
    return response.data;
  } else {
    const response = await axiosApi.get<ProductList[]>(`/products/?cat=${id}`);
    return response.data;
  }
});

export const fetchOneProduct = createAsyncThunk<ProductList, string>('product/fetchOne', async (id) => {
  const response = await axiosApi.get<ProductList | null>('/products/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

export const addToCart = createAsyncThunk<void, string>('product/addToCart', async (id) => {
  await axiosApi.patch('/cart/' + id + '/toggleCart');
});

interface ToUsersCart {
  idFamily: string;
  idProduct: string;
}

export const removeFromUsersCart = createAsyncThunk<void, ToUsersCart>(
  'product/removeFromUsersCart',
  async (params) => {
    await axiosApi.patch('/family/' + params.idFamily + '/toggleDeleteFromCart?product=' + params.idProduct);
  },
);
export const addToUsersCart = createAsyncThunk<void, ToUsersCart>('product/addToUsersCart', async (params) => {
  await axiosApi.patch('/family/' + params.idFamily + '/toggleAddTo?product=' + params.idProduct);
});

interface UpdateParams {
  id: string;
  name: ProductMutation;
}

export const updateProduct = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('product/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentProduct = getState().product.oneProduct;
    const formData = new FormData();
    formData.append('name', params.name.name);
    formData.append('description', params.name.description);
    formData.append('price', params.name.price);
    formData.append('category', params.name.category);
    if (params.name.image) {
      formData.append('image', params.name.image);
    }
    const response = await axiosApi.put('/products/' + params.id, formData);
    if (currentProduct && currentProduct._id === params.id) {
      dispatch(setProduct(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createProduct = createAsyncThunk<void, ProductMutation, { rejectValue: ValidationError }>(
  'product/create_product',
  async (productMutation, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(productMutation) as (keyof ProductMutation)[];
      keys.forEach((key) => {
        const value = productMutation[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });
      await axiosApi.post('/products', formData);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeProduct = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'product/remove_product',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/products/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
