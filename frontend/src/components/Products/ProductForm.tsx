import React, { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import { ProductMutation, ValidationError } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategoryList } from '../../features/category/CategorySlice';
import { fetchCategory } from '../../features/category/CategoryThunk';
import FileInput from '../FileInput/FileInput';

interface Props {
  onSubmit: (mutation: ProductMutation) => void;
  error: ValidationError | null;
  isEdit?: boolean;
  Loading: boolean;
  existingProduct?: ProductMutation;
}

const initialState: ProductMutation = {
  category: '',
  name: '',
  price: '',
  description: '',
  image: null,
};

const ProductForm: React.FC<Props> = ({ onSubmit, error, Loading, existingProduct = initialState, isEdit }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategoryList);
  const [state, setState] = useState<ProductMutation>(existingProduct);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const submitFormHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <form autoComplete="off" onSubmit={submitFormHandler}>
      {Loading ? <CircularProgress /> : isEdit ? 'Edit product' : 'Create produc'}
      <Grid container direction="column" sx={{ alignItems: 'stretch', width: '100%' }} spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            id="category"
            label="Category"
            value={state.category}
            onChange={inputChangeHandler}
            required
            sx={{ minWidth: '200px' }}
            name="category"
            error={Boolean(getFieldError('category'))}
            helperText={getFieldError('category')}
          >
            <MenuItem value="" disabled>
              Select a category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="name"
            label="Title"
            value={state.name}
            onChange={inputChangeHandler}
            name="name"
            required
            error={Boolean(getFieldError('name'))}
            helperText={getFieldError('name')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            id="price"
            label="Price"
            value={state.price}
            onChange={inputChangeHandler}
            name="price"
            required
            error={Boolean(getFieldError('price'))}
            helperText={getFieldError('price')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={9}
            fullWidth
            id="description"
            label="Description"
            value={state.description}
            onChange={inputChangeHandler}
            name="description"
            error={Boolean(getFieldError('description'))}
            helperText={getFieldError('description')}
          />
        </Grid>
        <Grid item lg>
          <FileInput onChange={fileInputChangeHandler} name="image" label="Image" />
        </Grid>
        <Grid item xs={12}>
          {error ? (
            <Alert sx={{ mb: 2 }} severity="error">
              {error.message}
            </Alert>
          ) : (
            ''
          )}
          <Button disabled={Loading} type="submit" color="info" variant="contained" sx={{ bgcolor: 'black' }}>
            {Loading ? <CircularProgress /> : isEdit ? 'Edit' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
