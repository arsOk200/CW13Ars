import React from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import Products from './containers/Products';
import Login from './containers/Login';
import Register from './containers/Register';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/user/userSlice';
import Protected from './components/Protected';
import NotFound from './containers/NotFound';
import CreateProduct from './components/Products/CreateProduct';
import CreateCategory from './components/Categories/CreateCategory';
import { ToastContainer } from 'react-toastify';
import Family from './containers/Family';
import Notes from './containers/Notes';
import ProductPage from './components/Products/RroductPage';
import FamilyPage from './components/Family/FamilyPage';
import Cart from './containers/Cart';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <Layout>
      <Routes>
        <Route element={<Protected userRole={user?.role} priority="" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<Protected userRole={user?.role} priority="admin" />}>
          <Route path="/create_product" element={<CreateProduct />} />
          <Route path="/create_category" element={<CreateCategory />} />
        </Route>
        <Route element={<Protected userRole={user?.role} priority="user" />}>
          <Route path="/family" element={<Family />} />
          <Route path="/family/:id" element={<FamilyPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/basket" element={<Cart />} />
        </Route>
        <Route path="/category/:id" element={<Products />} />
        <Route path="/" element={<Products />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Layout>
  );
}

export default App;
