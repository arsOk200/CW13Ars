import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { FamilyList, FamilyOne, GlobalError, ValidationError } from '../../types';
import {
  createFamily,
  fetchOneFamily,
  fetchFamily,
  removeFamily,
  updateFamily,
  addToFamily,
  LeaveFromFamily,
  fetchUsersFamilies,
} from './familyThunk';

interface familySlice {
  listFamily: FamilyList[];
  getAllFamilyLoading: boolean;
  createFamilyLoading: boolean;
  removeFamilyLoading: boolean;
  deletingFamily: string | false;
  familyError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneFamily: null | FamilyOne;
  updateFamilyLoading: boolean;
  oneFamilyLoading: boolean;
  addingToFamily: string | false;
  leavingFromFamily: string | false;
  usersFamilies: FamilyOne[];
  usersFamiliesLoading: boolean;
}

const initialState: familySlice = {
  listFamily: [],
  getAllFamilyLoading: false,
  createFamilyLoading: false,
  removeFamilyLoading: false,
  familyError: null,
  errorRemove: null,
  modal: false,
  oneFamily: null,
  updateFamilyLoading: false,
  oneFamilyLoading: false,
  deletingFamily: false,
  addingToFamily: false,
  leavingFromFamily: false,
  usersFamilies: [],
  usersFamiliesLoading: false,
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetFamily: (state) => {
      state.oneFamily = null;
    },
    setFamily: (state, action) => {
      state.oneFamily = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFamily.pending, (state) => {
      state.getAllFamilyLoading = true;
    });
    builder.addCase(fetchFamily.fulfilled, (state, { payload: list }) => {
      state.listFamily = list;
      state.getAllFamilyLoading = false;
    });
    builder.addCase(fetchFamily.rejected, (state) => {
      state.getAllFamilyLoading = false;
    });

    builder.addCase(fetchUsersFamilies.pending, (state) => {
      state.usersFamiliesLoading = true;
    });
    builder.addCase(fetchUsersFamilies.fulfilled, (state, { payload: list }) => {
      state.usersFamilies = list;
      state.usersFamiliesLoading = false;
    });
    builder.addCase(fetchUsersFamilies.rejected, (state) => {
      state.usersFamiliesLoading = false;
    });

    builder.addCase(fetchOneFamily.pending, (state) => {
      state.oneFamilyLoading = true;
    });
    builder.addCase(fetchOneFamily.fulfilled, (state, { payload: family }) => {
      state.oneFamilyLoading = false;
      state.oneFamily = family;
    });
    builder.addCase(fetchOneFamily.rejected, (state) => {
      state.oneFamilyLoading = false;
    });

    builder.addCase(updateFamily.pending, (state) => {
      state.updateFamilyLoading = true;
    });
    builder.addCase(updateFamily.fulfilled, (state) => {
      state.updateFamilyLoading = false;
    });
    builder.addCase(updateFamily.rejected, (state, { payload: error }) => {
      state.updateFamilyLoading = false;
      state.familyError = error || null;
    });

    builder.addCase(createFamily.pending, (state) => {
      state.familyError = null;
      state.createFamilyLoading = true;
    });
    builder.addCase(createFamily.fulfilled, (state) => {
      state.createFamilyLoading = false;
    });
    builder.addCase(createFamily.rejected, (state, { payload: error }) => {
      state.familyError = error || null;
      state.createFamilyLoading = false;
    });

    builder.addCase(removeFamily.pending, (state, { meta: { arg: familyID } }) => {
      state.removeFamilyLoading = true;
      state.deletingFamily = familyID;
    });
    builder.addCase(removeFamily.fulfilled, (state) => {
      state.removeFamilyLoading = false;
    });
    builder.addCase(removeFamily.rejected, (state, { payload: error }) => {
      state.removeFamilyLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });

    builder.addCase(addToFamily.pending, (state, { meta: { arg: id } }) => {
      state.addingToFamily = id;
    });
    builder.addCase(addToFamily.fulfilled, (state) => {
      state.addingToFamily = false;
    });
    builder.addCase(addToFamily.rejected, (state) => {
      state.addingToFamily = false;
    });
    builder.addCase(LeaveFromFamily.pending, (state, { meta: { arg: id } }) => {
      state.leavingFromFamily = id;
    });
    builder.addCase(LeaveFromFamily.fulfilled, (state) => {
      state.leavingFromFamily = false;
    });
    builder.addCase(LeaveFromFamily.rejected, (state) => {
      state.leavingFromFamily = false;
    });
  },
});
export const { setFamily, unsetFamily } = familySlice.actions;
export const familyReducer = familySlice.reducer;
export const { controlModal } = familySlice.actions;
export const selectFamilyList = (state: RootState) => state.family.listFamily;
export const selectGetAllFamilyLoading = (state: RootState) => state.family.getAllFamilyLoading;
export const selectDeletingFamily = (state: RootState) => state.family.deletingFamily;
export const selectCreateFamilyLoading = (state: RootState) => state.family.createFamilyLoading;
export const selectRemoveFamilyLoading = (state: RootState) => state.family.removeFamilyLoading;
export const selectFamilyError = (state: RootState) => state.family.familyError;
export const selectErrorRemove = (state: RootState) => state.family.errorRemove;
export const selectModal = (state: RootState) => state.family.modal;
export const selectOneFamily = (state: RootState) => state.family.oneFamily;
export const selectOneFamilyLoading = (state: RootState) => state.family.oneFamilyLoading;
export const selectUpdateFamilyLoading = (state: RootState) => state.family.updateFamilyLoading;
export const selectUsersFamiliesLoading = (state: RootState) => state.family.usersFamiliesLoading;
export const selectUsersFamilies = (state: RootState) => state.family.usersFamilies;
