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
import { apiUrl } from '../../constants';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { Link } from 'react-router-dom';

interface Props {
  product: ProductList;
  deleteProduct: React.MouseEventHandler;
  deletingProduct: string | false;
  onEditing: React.MouseEventHandler;
}

const ProductItem: React.FC<Props> = ({ product, deleteProduct, deletingProduct, onEditing }) => {
  const user = useAppSelector(selectUser);
  let buttons = (
    <Typography variant="h6" sx={{ color: 'white' }}>
      <Link style={{ color: 'black', fontWeight: 'bold' }} to={'/login'}>
        Buy
      </Link>
    </Typography>
  );

  if (user?.role === 'admin') {
    buttons = (
      <>
        <Button size="small" sx={{ color: 'black' }}>
          <ShoppingBasketIcon />
        </Button>
        <Button
          disabled={deletingProduct ? deletingProduct === product._id : false}
          size="small"
          sx={{ color: 'black' }}
          onClick={deleteProduct}
        >
          <DeleteIcon />
        </Button>
        <Button size="small" sx={{ color: 'black' }} onClick={onEditing}>
          <EditIcon />
        </Button>
      </>
    );
  } else if (user?.role === 'user') {
    buttons = (
      <Button size="small" sx={{ color: 'black' }}>
        <ShoppingBasketIcon />
      </Button>
    );
  }
  return (
    <Card sx={{ maxWidth: 300, margin: '10px' }}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={apiUrl + '/images/' + product.image} alt={product.name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {product.category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.price} SOM
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>{buttons}</CardActions>
    </Card>
  );
};

export default ProductItem;
