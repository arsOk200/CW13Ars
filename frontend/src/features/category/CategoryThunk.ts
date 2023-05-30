import { CategoryList, CategoryMutation, GlobalError, ValidationError } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../app/store';
import { setCategory } from './CategorySlice';

export const fetchCategory = createAsyncThunk<CategoryList[]>('category/fetch_category', async () => {
  const response = await axiosApi.get<CategoryList[]>('/category');
  return response.data;
});

export const fetchOneCategory = createAsyncThunk<CategoryList, string>('category/fetchOne', async (id) => {
  const response = await axiosApi.get<CategoryList | null>('/category/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  area: CategoryMutation;
}

export const updateCategory = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('category/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentCategory = getState().category.oneCategory;
    const response = await axiosApi.put('/category/' + params.id, params.area);
    if (currentCategory && currentCategory._id === params.id) {
      dispatch(setCategory(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createCategory = createAsyncThunk<void, CategoryMutation, { rejectValue: ValidationError }>(
  'category/create_category',
  async (categoryMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/category', categoryMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeCategory = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'category/remove_category',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/category/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
