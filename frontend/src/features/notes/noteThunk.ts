import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalError, NoteList, ValidationError, NoteMutation } from '../../types';
import axiosApi from '../../axiosApi';
import { AppDispatch, RootState } from '../../app/store';
import { setNote } from './noteSlice';
import { isAxiosError } from 'axios';

export const fetchNote = createAsyncThunk<NoteList[]>('note/fetch_note', async () => {
  const response = await axiosApi.get<NoteList[]>('/note');
  return response.data;
});

export const fetchOneNote = createAsyncThunk<NoteList, string>('note/fetchOne', async (id) => {
  const response = await axiosApi.get<NoteList | null>('/note/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: NoteMutation;
}

export const updateNote = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('note/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentNote = getState().Note.oneNote;
    const response = await axiosApi.put('/note/' + params.id, params.name);
    if (currentNote && currentNote._id === params.id) {
      dispatch(setNote(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createNote = createAsyncThunk<void, NoteMutation, { rejectValue: ValidationError }>(
  'note/create_note',
  async (noteMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/note', noteMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeNote = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'note/remove_note',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/note/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);
