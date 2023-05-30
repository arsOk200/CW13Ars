import React, { useEffect } from 'react';
import ProductsList from '../components/Products/ProductsList';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCategoryList, selectGetAllCategoryLoading } from '../features/category/CategorySlice';
import { fetchCategory } from '../features/category/CategoryThunk';

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const categories = useAppSelector(selectCategoryList);
  const categoryLoading = useAppSelector(selectGetAllCategoryLoading);

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);
  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item sx={{ marginBottom: '20px' }}>
          <Typography variant="caption" sx={{ color: 'black', fontWeight: 'bold' }}>
            CATEGORIES
          </Typography>
          <Button
            sx={{ color: 'black' }}
            onClick={() => {
              navigate('/');
            }}
          >
            All
          </Button>
          {categoryLoading ? (
            <Typography variant="subtitle1">Loading...</Typography>
          ) : (
            categories.map((category) => (
              <Button
                key={category._id}
                sx={{ color: 'black' }}
                onClick={() => {
                  navigate('/category/' + category.name);
                }}
              >
                {category.name}
              </Button>
            ))
          )}
        </Grid>
      </Grid>
      <Box>{!outlet ? <ProductsList /> : outlet}</Box>
    </Box>
  );
};

export default Products;
