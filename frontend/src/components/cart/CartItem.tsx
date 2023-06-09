import React from 'react';
import { ProductList } from '../../types';
import CardContent from '@mui/material/CardContent';
import { CardActions, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import { apiUrl } from '../../constants';
import CardMedia from '@mui/material/CardMedia';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductList;
  deleteProductFromCart: React.MouseEventHandler;
  deleteLoading: string | false;
}

const CartItem: React.FC<Props> = ({ product, deleteProductFromCart, deleteLoading }) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: '98%', margin: '20px 5px', border: '1px solid black' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid>
          <Typography variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2">{product.price} SOM</Typography>
        </Grid>
        <CardMedia
          component="img"
          sx={{ width: '50px', height: '100px' }}
          image={apiUrl + '/' + product.image}
          alt={product.name}
        />
      </CardContent>
      <CardActions>
        <IconButton
          disabled={deleteLoading ? deleteLoading === product._id : false}
          aria-label="delete"
          onClick={deleteProductFromCart}
        >
          {deleteLoading && deleteLoading === product._id && <CircularProgress />}
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => navigate('/product/' + product._id)}>
          <MoreHorizIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CartItem;
