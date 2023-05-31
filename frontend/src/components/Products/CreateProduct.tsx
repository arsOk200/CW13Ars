import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../features/products/productsThunk';
import { ProductMutation } from '../../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from './ProductForm';
import { Typography } from '@mui/material';
import { selectCreateProductLoading, selectProductError } from '../../features/products/productsSlice';

const CreateProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectProductError);
  const createLoading = useAppSelector(selectCreateProductLoading);

  const onFormSubmit = async (ProductMutation: ProductMutation) => {
    try {
      await dispatch(createProduct(ProductMutation)).unwrap();
      navigate('/');
      toast('Product Created');
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        New product
      </Typography>
      <ProductForm onSubmit={onFormSubmit} error={error} Loading={createLoading} />
    </>
  );
};

export default CreateProduct;
