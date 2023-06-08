import React, { useEffect } from 'react';
import CartItem from '../components/cart/CartItem';
import { Alert, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCart, selectDeleteCartLoading, selectFetchCartLoading } from '../features/Cart/cartSlice';
import { deleteFromCart, fetchCart } from '../features/Cart/cartThunk';
import useConfirm from '../components/Confirm&Alert/useConfirm';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useAppDispatch();
  const fetchingCart = useAppSelector(selectFetchCartLoading);
  const Cart = useAppSelector(selectCart);
  const deleteLoading = useAppSelector(selectDeleteCartLoading);
  const { confirm } = useConfirm();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const removeFromCart = async (id: string) => {
    if (await confirm('Delete', 'Do you really want to delete?')) {
      await dispatch(deleteFromCart(id));
      await dispatch(fetchCart());
      toast('Product deleted from your cart');
    } else {
      return;
    }
  };

  if (!Cart) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Typography component="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
        My cart
      </Typography>
      <Button sx={{ color: 'red', marginBottom: '30px ' }}>Buy</Button>
      <Container>
        <Paper elevation={3} sx={{ maxWidth: '100%', height: '500px', overflowX: 'hidden' }}>
          {!fetchingCart ? (
            Cart?.cart.length !== 0 ? (
              Cart?.cart.map((item) => (
                <CartItem
                  key={item._id}
                  product={item}
                  deleteProductFromCart={() => removeFromCart(item._id)}
                  deleteLoading={deleteLoading}
                />
              ))
            ) : (
              <Alert severity="warning">there are no products in your cart</Alert>
            )
          ) : (
            <CircularProgress />
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Cart;
