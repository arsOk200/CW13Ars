import { createSlice } from '@reduxjs/toolkit';
import { NoteList, GlobalError, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { createNote, fetchNote, fetchOneNote, removeNote, updateNote } from './noteThunk';

interface NoteSlice {
  listNote: NoteList[];
  getAllNoteLoading: boolean;
  createNoteLoading: boolean;
  removeNoteLoading: string | false;
  NoteError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneNote: null | NoteList;
  updateNoteLoading: boolean;
  oneNoteLoading: boolean;
}

const initialState: NoteSlice = {
  listNote: [],
  getAllNoteLoading: false,
  createNoteLoading: false,
  removeNoteLoading: false,
  NoteError: null,
  errorRemove: null,
  modal: false,
  oneNote: null,
  updateNoteLoading: false,
  oneNoteLoading: false,
};

const NoteSlice = createSlice({
  name: 'Note',
  initialState,
  reducers: {
    setNote: (state, action) => {
      state.oneNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNote.pending, (state) => {
      state.getAllNoteLoading = true;
    });
    builder.addCase(fetchNote.fulfilled, (state, { payload: list }) => {
      state.listNote = list;
      state.getAllNoteLoading = false;
    });
    builder.addCase(fetchNote.rejected, (state) => {
      state.getAllNoteLoading = false;
    });

    builder.addCase(fetchOneNote.pending, (state) => {
      state.oneNoteLoading = true;
    });
    builder.addCase(fetchOneNote.fulfilled, (state, { payload: Note }) => {
      state.oneNoteLoading = false;
      state.oneNote = Note;
    });
    builder.addCase(fetchOneNote.rejected, (state) => {
      state.oneNoteLoading = false;
    });

    builder.addCase(updateNote.pending, (state) => {
      state.updateNoteLoading = true;
    });
    builder.addCase(updateNote.fulfilled, (state) => {
      state.updateNoteLoading = false;
    });
    builder.addCase(updateNote.rejected, (state, { payload: error }) => {
      state.updateNoteLoading = false;
      state.NoteError = error || null;
    });

    builder.addCase(createNote.pending, (state) => {
      state.NoteError = null;
      state.createNoteLoading = true;
    });
    builder.addCase(createNote.fulfilled, (state) => {
      state.createNoteLoading = false;
    });
    builder.addCase(createNote.rejected, (state, { payload: error }) => {
      state.NoteError = error || null;
      state.createNoteLoading = false;
    });

    builder.addCase(removeNote.pending, (state, { meta: { arg: id } }) => {
      state.removeNoteLoading = id;
    });
    builder.addCase(removeNote.fulfilled, (state) => {
      state.removeNoteLoading = false;
    });
    builder.addCase(removeNote.rejected, (state, { payload: error }) => {
      state.removeNoteLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setNote } = NoteSlice.actions;
export const NoteReducer = NoteSlice.reducer;
export const selectNoteList = (state: RootState) => state.Note.listNote;
export const selectGetAllNoteLoading = (state: RootState) => state.Note.getAllNoteLoading;
export const selectCreateNoteLoading = (state: RootState) => state.Note.createNoteLoading;
export const selectRemoveNoteLoading = (state: RootState) => state.Note.removeNoteLoading;
export const selectNoteError = (state: RootState) => state.Note.NoteError;
export const selectErrorRemove = (state: RootState) => state.Note.errorRemove;
export const selectModal = (state: RootState) => state.Note.modal;
export const selectOneNote = (state: RootState) => state.Note.oneNote;
export const selectOneNoteLoading = (state: RootState) => state.Note.oneNoteLoading;
export const selectUpdateNoteLoading = (state: RootState) => state.Note.updateNoteLoading;
