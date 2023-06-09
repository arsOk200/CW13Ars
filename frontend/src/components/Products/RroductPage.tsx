import React, { useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { apiUrl } from '../../constants';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectOneProduct, selectOneProductLoading } from '../../features/products/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../../features/user/userSlice';
import { fetchOneProduct, fetchProduct, removeProduct } from '../../features/products/productsThunk';

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams() as { id: string };
  const user = useAppSelector(selectUser);
  const oneProduct = useAppSelector(selectOneProduct);
  const oneProductLoading = useAppSelector(selectOneProductLoading);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchOneProduct(id));
  }, [dispatch, id]);

  const deletingProduct = async () => {
    await dispatch(removeProduct(id));
    await dispatch(fetchProduct());
    navigate('/');
  };

  let buttons;
  if (user?.role === 'admin') {
    buttons = (
      <Grid item xs>
        <Button type="button" onClick={deletingProduct} disabled={oneProductLoading} color="error" variant="contained">
          Delete
        </Button>
      </Grid>
    );
  }

  return (
    <Grid container alignItems="center" flexDirection="column">
      <Grid
        container
        alignItems="center"
        flexDirection="column"
        sx={{
          borderLeft: '3px solid black',
          borderRight: '3px solid black',
          borderBottom: '3px solid black',
          borderRadius: '10px',
          margin: '10px',
        }}
      >
        <Box padding="10px">
          <img style={{ maxWidth: '100%' }} src={apiUrl + '/' + oneProduct?.image} alt={oneProduct?.name} />
        </Box>
        <Grid padding="20px" container alignSelf="start">
          <Grid width="100%" flexDirection="column" borderTop="1px solid #252525">
            <Typography gutterBottom variant="h5" component="h4">
              <b>Name: {oneProduct?.name}</b>
            </Typography>
            <Typography gutterBottom variant="h5" component="h4">
              <b>Category: {oneProduct?.category.name}</b>
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              <b>Price:</b> {oneProduct?.price} Som
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              <b>Description:</b> {oneProduct?.description}
            </Typography>
            {buttons}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductPage;
