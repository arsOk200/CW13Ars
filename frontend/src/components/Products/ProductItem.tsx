import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { ProductList } from '../../types';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../constants';

interface Props {
  product: ProductList;
}

const ProductItem: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 300, margin: '10px' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={apiUrl + '/images/products/' + product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" sx={{ color: 'black' }}>
          <ShoppingBasketIcon />
        </Button>
        <Button size="small" sx={{ color: 'black' }}>
          <DeleteIcon />
        </Button>
        <Button size="small" sx={{ color: 'black' }}>
          <EditIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
