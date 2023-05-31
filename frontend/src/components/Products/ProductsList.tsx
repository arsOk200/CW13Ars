import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectDeletingProduct,
  selectGetAllProductLoading,
  selectOneProduct,
  selectProductError,
  selectProductList,
  selectUpdateProductLoading,
} from '../../features/products/productsSlice';
import { fetchOneProduct, fetchProduct, removeProduct, updateProduct } from '../../features/products/productsThunk';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useParams } from 'react-router-dom';
import useConfirm from '../Confirm&Alert/useConfirm';
import { ProductMutation } from '../../types';
import { toast } from 'react-toastify';
import ModalBody from '../ModalBody';
import ProductForm from './ProductForm';

const ProductsList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductList);
  const productsLoading = useAppSelector(selectGetAllProductLoading);
  const deletingProduct = useAppSelector(selectDeletingProduct);
  const product = useAppSelector(selectOneProduct);
  const updateLoading = useAppSelector(selectUpdateProductLoading);
  const error = useAppSelector(selectProductError);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [IDFor, setIdFor] = useState('');
  const { id } = useParams();
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const deleteProduct = async (ID: string) => {
    if (await confirm('Delete', 'Do you really want to delete?')) {
      await dispatch(removeProduct(ID));
      await dispatch(fetchProduct(id));
      toast('Product deleted');
    } else {
      return;
    }
  };

  const openDialog = async (ID: string) => {
    await dispatch(fetchOneProduct(ID));
    setIdFor(ID);
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (ToChange: ProductMutation) => {
    if (await confirm('Edit', 'Do you really want to Edit?')) {
      try {
        await dispatch(updateProduct({ id: IDFor, name: ToChange })).unwrap();
        await dispatch(fetchProduct()).unwrap();
        setIsDialogOpen(false);
        toast('Product Edited');
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
    } else {
      return;
    }
  };
  const existingProduct = product && {
    ...product,
    price: product.price.toString(),
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
              onEditing={() => openDialog(product._id)}
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
      {existingProduct && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <ProductForm
            error={error}
            onSubmit={onFormSubmit}
            existingProduct={existingProduct}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
    </Container>
  );
};

export default ProductsList;
