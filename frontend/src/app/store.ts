import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import { usersReducer } from '../features/user/userSlice';
import { categoryReducer } from '../features/category/CategorySlice';
import { productReducer } from '../features/products/productsSlice';
import { familyReducer } from '../features/family/familySlice';
import { NoteReducer } from '../features/notes/noteSlice';
import { CartReducer } from '../features/Cart/cartSlice';

const usersPersistConfig = {
  key: 'OnlineShop:users',
  storage,
  whitelist: ['user'],
};
const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  category: categoryReducer,
  product: productReducer,
  family: familyReducer,
  Note: NoteReducer,
  cart: CartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
