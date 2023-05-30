import React, { useEffect } from 'react';
import ProductItem from './ProductItem';
import { CircularProgress, Container, TableCell, TableRow, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGetAllProductLoading, selectProductList } from '../../features/products/productsSlice';
import { fetchProduct } from '../../features/products/productsThunk';
import BackHandIcon from '@mui/icons-material/BackHand';

const ProductsList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductList);
  const productsLoading = useAppSelector(selectGetAllProductLoading);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);
  return (
    <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {!productsLoading ? (
        products.length !== 0 ? (
          products.map((product) => <ProductItem key={product._id} product={product} />)
        ) : (
          <>
            <BackHandIcon fontSize="large" />
            <Typography variant="h5" sx={{ marginLeft: '5px' }}>
              There are no products at the moment!
            </Typography>
          </>
        )
      ) : (
        <TableRow>
          <TableCell>
            <CircularProgress />
          </TableCell>
        </TableRow>
      )}
    </Container>
  );
};

export default ProductsList;
