import { FamilyList, FamilyMutation, FamilyOne, GlobalError, ValidationError } from '../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../app/store';
import { setFamily } from './familySlice';

export const fetchFamily = createAsyncThunk<FamilyList[]>('family/fetch_family', async () => {
  const response = await axiosApi.get<FamilyList[]>('/family');
  return response.data;
});

export const fetchOneFamily = createAsyncThunk<FamilyOne, string>('family/fetchOne', async (id) => {
  const response = await axiosApi.get<FamilyOne | null>('/family/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: FamilyMutation;
}

export const updateFamily = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('family/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentFamily = getState().family.oneFamily;
    const response = await axiosApi.put('/family/' + params.id, params.name);
    if (currentFamily && currentFamily._id === params.id) {
      dispatch(setFamily(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createFamily = createAsyncThunk<void, FamilyMutation, { rejectValue: ValidationError }>(
  'family/create_family',
  async (familyMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/family', familyMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeFamily = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'family/remove_family',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/family/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const addToFamily = createAsyncThunk<void, string>('family/addTo', async (id) => {
  await axiosApi.patch('/family/' + id + '/toggleAdd');
});

export const LeaveFromFamily = createAsyncThunk<void, string>('family/leaveFrom', async (id) => {
  await axiosApi.patch('/family/' + id + '/toggleDelete');
});
