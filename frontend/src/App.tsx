import React from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import Products from './containers/Products';
import Login from './containers/Login';
import Register from './containers/Register';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Layout>
  );
}

export default App;
