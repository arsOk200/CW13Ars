import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import { CategoryList } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import { StyledTableRow } from '../../constants';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  category: CategoryList;
  removeCategoryItem: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
  deleteLoading: string | false;
}

const CategoryItem: React.FC<Props> = ({ category, removeCategoryItem, onEditing, deleteLoading }) => {
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{category.name}</TableCell>
        <TableCell align="right">
          <IconButton
            disabled={deleteLoading ? deleteLoading === category._id : false}
            onClick={removeCategoryItem}
            aria-label="delete"
          >
            {deleteLoading && deleteLoading === category._id && <CircularProgress />}
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="success" onClick={onEditing}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CategoryItem;
