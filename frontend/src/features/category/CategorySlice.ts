import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryList, GlobalError, ValidationError } from '../../types';
import { createCategory, fetchCategory, fetchOneCategory, removeCategory, updateCategory } from './CategoryThunk';
import { RootState } from '../../app/store';

interface categorySlice {
  listCategory: CategoryList[];
  getAllCategoryLoading: boolean;
  createCategoryLoading: boolean;
  removeCategoryLoading: boolean;
  categoryError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneCategory: null | CategoryList;
  updateCategoryLoading: boolean;
  oneCategoryLoading: boolean;
}

const initialState: categorySlice = {
  listCategory: [],
  getAllCategoryLoading: false,
  createCategoryLoading: false,
  removeCategoryLoading: false,
  categoryError: null,
  errorRemove: null,
  modal: false,
  oneCategory: null,
  updateCategoryLoading: false,
  oneCategoryLoading: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetCategory: (state) => {
      state.oneCategory = null;
    },
    setCategory: (state, action) => {
      state.oneCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategory.pending, (state) => {
      state.getAllCategoryLoading = true;
    });
    builder.addCase(fetchCategory.fulfilled, (state, { payload: list }) => {
      state.listCategory = list;
      state.getAllCategoryLoading = false;
    });
    builder.addCase(fetchCategory.rejected, (state) => {
      state.getAllCategoryLoading = false;
    });

    builder.addCase(fetchOneCategory.pending, (state) => {
      state.oneCategoryLoading = true;
    });
    builder.addCase(fetchOneCategory.fulfilled, (state, { payload: category }) => {
      state.oneCategoryLoading = false;
      state.oneCategory = category;
    });
    builder.addCase(fetchOneCategory.rejected, (state) => {
      state.oneCategoryLoading = false;
    });

    builder.addCase(updateCategory.pending, (state) => {
      state.updateCategoryLoading = true;
    });
    builder.addCase(updateCategory.fulfilled, (state) => {
      state.updateCategoryLoading = false;
    });
    builder.addCase(updateCategory.rejected, (state, { payload: error }) => {
      state.updateCategoryLoading = false;
      state.categoryError = error || null;
    });

    builder.addCase(createCategory.pending, (state) => {
      state.categoryError = null;
      state.createCategoryLoading = true;
    });
    builder.addCase(createCategory.fulfilled, (state) => {
      state.createCategoryLoading = false;
    });
    builder.addCase(createCategory.rejected, (state, { payload: error }) => {
      state.categoryError = error || null;
      state.createCategoryLoading = false;
    });

    builder.addCase(removeCategory.pending, (state) => {
      state.removeCategoryLoading = true;
    });
    builder.addCase(removeCategory.fulfilled, (state) => {
      state.removeCategoryLoading = false;
    });
    builder.addCase(removeCategory.rejected, (state, { payload: error }) => {
      state.removeCategoryLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setCategory, unsetCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
export const { controlModal } = categorySlice.actions;
export const selectCategoryList = (state: RootState) => state.category.listCategory;
export const selectGetAllCategoryLoading = (state: RootState) => state.category.getAllCategoryLoading;
export const selectCreateCategoryLoading = (state: RootState) => state.category.createCategoryLoading;
export const selectRemoveCategoryLoading = (state: RootState) => state.category.removeCategoryLoading;
export const selectCategoryError = (state: RootState) => state.category.categoryError;
export const selectErrorRemove = (state: RootState) => state.category.errorRemove;
export const selectModal = (state: RootState) => state.category.modal;
export const selectOneCategory = (state: RootState) => state.category.oneCategory;
export const selectOneCategoryLoading = (state: RootState) => state.category.oneCategoryLoading;
export const selectUpdateCategoryLoading = (state: RootState) => state.category.updateCategoryLoading;