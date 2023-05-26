import React from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import Products from './containers/Products';
import Login from './containers/Login';
import Register from './containers/Register';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/user/userSlice';
import Protected from './components/Protected';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route element={<Protected userRole={user?.role} priority="" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<Products />} />
      </Routes>
    </Layout>
  );
}

export default App;
