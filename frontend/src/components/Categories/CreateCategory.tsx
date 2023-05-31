import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';
import { createCategory } from '../../features/category/CategoryThunk';
import { CategoryMutation } from '../../types';
import { selectCategoryError, selectCreateCategoryLoading } from '../../features/category/CategorySlice';
import CategoryForm from './CategoryForm';

const CreateCategory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectCategoryError);
  const createLoading = useAppSelector(selectCreateCategoryLoading);
  const onFormSubmit = async (CategoryMutation: CategoryMutation) => {
    try {
      await dispatch(createCategory(CategoryMutation)).unwrap();
      navigate('/');
      toast('Category created!');
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  };
  return (
    <>
      <Typography sx={{ mb: 2 }} variant="h4">
        New product
      </Typography>
      <CategoryForm onSubmit={onFormSubmit} error={error} Loading={createLoading} />
    </>
  );
};

export default CreateCategory;
