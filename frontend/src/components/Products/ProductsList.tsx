import React, { useEffect } from 'react';
import ProductItem from './ProductItem';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectDeletingProduct,
  selectGetAllProductLoading,
  selectProductList,
} from '../../features/products/productsSlice';
import { fetchProduct, removeProduct } from '../../features/products/productsThunk';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useParams } from 'react-router-dom';
import useConfirm from '../Confirm&Alert/useConfirm';

const ProductsList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductList);
  const productsLoading = useAppSelector(selectGetAllProductLoading);
  const deletingProduct = useAppSelector(selectDeletingProduct);
  const { id } = useParams();
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const deleteProduct = async (ID: string) => {
    if (await confirm('Delete', 'Do you really want to delete?')) {
      await dispatch(removeProduct(ID));
      await dispatch(fetchProduct(id));
    } else {
      return;
    }
  };
  return (
    <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {!productsLoading ? (
        products.length !== 0 ? (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              deleteProduct={() => deleteProduct(product._id)}
              deletingProduct={deletingProduct}
            />
          ))
        ) : (
          <>
            <BackHandIcon fontSize="large" />
            <Typography variant="h5" sx={{ marginLeft: '5px' }}>
              There are no products at the moment!
            </Typography>
          </>
        )
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default ProductsList;
