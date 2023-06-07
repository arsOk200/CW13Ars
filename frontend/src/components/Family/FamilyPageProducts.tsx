import React from 'react';
import { StyledTableRow } from '../../constants';
import { Box, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductList, User } from '../../types';
import { Navigate, useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';

interface Props {
  product: ProductList;
  FamilyUsers: User[];
  deleteFromCart: React.MouseEventHandler;
}

const FamilyPageProducts: React.FC<Props> = ({ product, FamilyUsers, deleteFromCart }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  let buttons;

  if (!user) {
    return <Navigate to="/" />;
  }
  const find = FamilyUsers.some((Users) => Users._id === user._id);

  if (user._id && find) {
    buttons = (
      <IconButton aria-label="delete" onClick={deleteFromCart}>
        <DeleteIcon />
      </IconButton>
    );
  }
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">
          {product.name} {product.price}som
        </TableCell>
        <TableCell align="right">
          <Box>
            {buttons}
            <IconButton aria-label="delete" onClick={() => navigate('/product/' + product._id)}>
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default FamilyPageProducts;
