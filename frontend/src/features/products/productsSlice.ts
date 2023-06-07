import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { GlobalError, ProductList, ValidationError } from '../../types';
import {
  addToCart,
  addToUsersCart,
  createProduct,
  fetchOneProduct,
  fetchProduct,
  removeFromUsersCart,
  removeProduct,
  updateProduct,
} from './productsThunk';

interface productSlice {
  listProduct: ProductList[];
  getAllProductLoading: boolean;
  createProductLoading: boolean;
  removeProductLoading: boolean;
  deletingProduct: string | false;
  productError: ValidationError | null;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneProduct: null | ProductList;
  updateProductLoading: boolean;
  oneProductLoading: boolean;
  adddingToMyCartLoadding: boolean;
  addingToFamiliesCart: boolean;
  deletingFromUsersCart: boolean;
}

const initialState: productSlice = {
  listProduct: [],
  getAllProductLoading: false,
  createProductLoading: false,
  removeProductLoading: false,
  productError: null,
  errorRemove: null,
  modal: false,
  oneProduct: null,
  updateProductLoading: false,
  oneProductLoading: false,
  deletingProduct: false,
  adddingToMyCartLoadding: false,
  addingToFamiliesCart: false,
  deletingFromUsersCart: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetProduct: (state) => {
      state.oneProduct = null;
    },
    setProduct: (state, action) => {
      state.oneProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.getAllProductLoading = true;
    });
    builder.addCase(fetchProduct.fulfilled, (state, { payload: list }) => {
      state.listProduct = list;
      state.getAllProductLoading = false;
    });
    builder.addCase(fetchProduct.rejected, (state) => {
      state.getAllProductLoading = false;
    });

    builder.addCase(fetchOneProduct.pending, (state) => {
      state.oneProductLoading = true;
    });
    builder.addCase(fetchOneProduct.fulfilled, (state, { payload: product }) => {
      state.oneProductLoading = false;
      state.oneProduct = product;
    });
    builder.addCase(fetchOneProduct.rejected, (state) => {
      state.oneProductLoading = false;
    });

    builder.addCase(updateProduct.pending, (state) => {
      state.updateProductLoading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state) => {
      state.updateProductLoading = false;
    });
    builder.addCase(updateProduct.rejected, (state, { payload: error }) => {
      state.updateProductLoading = false;
      state.productError = error || null;
    });

    builder.addCase(addToCart.pending, (state) => {
      state.adddingToMyCartLoadding = true;
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.adddingToMyCartLoadding = false;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.adddingToMyCartLoadding = false;
    });

    builder.addCase(addToUsersCart.pending, (state) => {
      state.addingToFamiliesCart = true;
    });
    builder.addCase(addToUsersCart.fulfilled, (state) => {
      state.addingToFamiliesCart = false;
    });
    builder.addCase(addToUsersCart.rejected, (state) => {
      state.addingToFamiliesCart = false;
    });

    builder.addCase(createProduct.pending, (state) => {
      state.productError = null;
      state.createProductLoading = true;
    });
    builder.addCase(createProduct.fulfilled, (state) => {
      state.createProductLoading = false;
    });
    builder.addCase(createProduct.rejected, (state, { payload: error }) => {
      state.productError = error || null;
      state.createProductLoading = false;
    });

    builder.addCase(removeFromUsersCart.pending, (state) => {
      state.deletingFromUsersCart = true;
    });
    builder.addCase(removeFromUsersCart.fulfilled, (state) => {
      state.deletingFromUsersCart = false;
    });
    builder.addCase(removeFromUsersCart.rejected, (state) => {
      state.deletingFromUsersCart = false;
    });
    builder.addCase(removeProduct.pending, (state, { meta: { arg: productID } }) => {
      state.removeProductLoading = true;
      state.deletingProduct = productID;
    });
    builder.addCase(removeProduct.fulfilled, (state) => {
      state.removeProductLoading = false;
    });
    builder.addCase(removeProduct.rejected, (state, { payload: error }) => {
      state.removeProductLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});
export const { setProduct, unsetProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
export const { controlModal } = productSlice.actions;
export const selectProductList = (state: RootState) => state.product.listProduct;
export const selectGetAllProductLoading = (state: RootState) => state.product.getAllProductLoading;
export const selectDeletingProduct = (state: RootState) => state.product.deletingProduct;
export const selectCreateProductLoading = (state: RootState) => state.product.createProductLoading;
export const selectRemoveProductLoading = (state: RootState) => state.product.removeProductLoading;
export const selectProductError = (state: RootState) => state.product.productError;
export const selectErrorRemove = (state: RootState) => state.product.errorRemove;
export const selectModal = (state: RootState) => state.product.modal;
export const selectOneProduct = (state: RootState) => state.product.oneProduct;
export const selectOneProductLoading = (state: RootState) => state.product.oneProductLoading;
export const selectUpdateProductLoading = (state: RootState) => state.product.updateProductLoading;
export const selectAddingToMyCart = (state: RootState) => state.product.adddingToMyCartLoadding;
export const selectAddToUsersCart = (state: RootState) => state.product.addingToFamiliesCart;
