import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import {
  GlobalError,
  LoginMutation,
  RegisterMutation,
  RegisterResponse,
  User,
  UserMutation,
  ValidationError,
} from '../../types';
import { setUser, unsetUser } from './userSlice';
import { AppDispatch, RootState } from '../../app/store';

export const register = createAsyncThunk<
  User,
  RegisterMutation,
  {
    rejectValue: ValidationError;
  }
>('users/register', async (registerMutation, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(registerMutation) as (keyof RegisterMutation)[];
    keys.forEach((key) => {
      const value = registerMutation[key];
      if (value !== null) {
        formData.append(key, value);
      }
    });
    const response = await axiosApi.post<RegisterResponse>('/users', formData);
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const login = createAsyncThunk<
  User,
  LoginMutation,
  {
    rejectValue: GlobalError;
  }
>('users/login', async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>('/users/sessions', loginMutation);
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as GlobalError);
    }
    throw e;
  }
});

export const logout = createAsyncThunk('users/logout', async (_, { dispatch }) => {
  await axiosApi.delete('/users/sessions');
  dispatch(unsetUser());
});

export const getEditingUser = createAsyncThunk<UserMutation, string>('users/getOne', async (id: string) => {
  try {
    const response = await axiosApi.get<User>('/users/' + id);
    const { username, displayName } = response.data;
    return { username, displayName, image: null, password: '' };
  } catch (e) {
    throw new Error('Not found!');
  }
});

interface UpdateUserParams {
  id: string;
  user: UserMutation;
}

export const updateUser = createAsyncThunk<
  void,
  UpdateUserParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('users/editOne', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentUser = getState().users.user;
    const formData = new FormData();
    formData.append('username', params.user.username);
    formData.append('password', params.user.password);
    formData.append('displayName', params.user.displayName);
    if (params.user.image) {
      formData.append('image', params.user.image);
    }
    const response = await axiosApi.put('users/' + params.id, formData);
    if (currentUser && currentUser._id === params.id) {
      dispatch(setUser(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});
