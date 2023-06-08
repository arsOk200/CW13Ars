import { RootState } from '../../app/store';
import { createSlice } from '@reduxjs/toolkit';
import { getEditingUser, login, register, updateUser } from './userThunks';
import { GlobalError, User, UserMutation, ValidationError } from '../../types';

interface UsersState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  oneEditUser: UserMutation | null;
  getOneLoading: boolean;
  editingError: ValidationError | null;
  editOneLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  registerError: null,
  registerLoading: false,
  loginError: null,
  loginLoading: false,
  oneEditUser: null,
  getOneLoading: false,
  editingError: null,
  editOneLoading: false,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.registerLoading = true;
      state.registerError = null;
    });
    builder.addCase(register.fulfilled, (state, { payload: user }) => {
      state.registerLoading = false;
      state.user = user;
    });
    builder.addCase(register.rejected, (state, { payload: error }) => {
      state.registerLoading = false;
      state.registerError = error || null;
    });
    builder.addCase(login.pending, (state) => {
      state.loginLoading = true;
      state.loginError = null;
    });
    builder.addCase(login.fulfilled, (state, { payload: user }) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });

    builder.addCase(getEditingUser.pending, (state) => {
      state.oneEditUser = null;
      state.getOneLoading = true;
    });
    builder.addCase(getEditingUser.fulfilled, (state, { payload }) => {
      state.oneEditUser = payload;
      state.getOneLoading = false;
    });
    builder.addCase(getEditingUser.rejected, (state) => {
      state.getOneLoading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.editingError = null;
      state.editOneLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.editOneLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, { payload: error }) => {
      state.editingError = error || null;
      state.editOneLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, setUser } = usersSlice.actions;
export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectOneUserForEdit = (state: RootState) => state.users.oneEditUser;
export const selectOneUserForEditLoading = (state: RootState) => state.users.getOneLoading;
export const selectOneUserForEditError = (state: RootState) => state.users.editingError;
export const selectOneUserForEditUpdateLoading = (state: RootState) => state.users.editOneLoading;
