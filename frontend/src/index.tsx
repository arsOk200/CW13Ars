import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import { addInterceptors } from './axiosApi';
import DialogsProvider from './components/Confirm&Alert/DialogsProvider';
addInterceptors(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <DialogsProvider>
          <App />
        </DialogsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
