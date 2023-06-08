import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { CartList } from '../../types';
import { addToCart, deleteFromCart, fetchCart } from './cartThunk';

interface CartSlice {
  addingToMyCartLoading: boolean;
  Cart: CartList | null;
  fetchCartLoading: boolean;
  deleteLoading: string | false;
}

const initialState: CartSlice = {
  addingToMyCartLoading: false,
  Cart: null,
  fetchCartLoading: false,
  deleteLoading: false,
};

const CartSlice = createSlice({
  name: 'Cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.fetchCartLoading = true;
    });
    builder.addCase(fetchCart.fulfilled, (state, { payload: Cart }) => {
      state.fetchCartLoading = false;
      state.Cart = Cart;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.fetchCartLoading = false;
    });
    builder.addCase(addToCart.pending, (state) => {
      state.addingToMyCartLoading = true;
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.addingToMyCartLoading = false;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.addingToMyCartLoading = false;
    });
    builder.addCase(deleteFromCart.pending, (state, { meta: { arg: id } }) => {
      state.deleteLoading = id;
    });
    builder.addCase(deleteFromCart.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(deleteFromCart.rejected, (state) => {
      state.deleteLoading = false;
    });
  },
});
export const CartReducer = CartSlice.reducer;
export const selectAddToMyCart = (state: RootState) => state.cart.addingToMyCartLoading;
export const selectCart = (state: RootState) => state.cart.Cart;
export const selectFetchCartLoading = (state: RootState) => state.cart.fetchCartLoading;
export const selectDeleteCartLoading = (state: RootState) => state.cart.deleteLoading;
