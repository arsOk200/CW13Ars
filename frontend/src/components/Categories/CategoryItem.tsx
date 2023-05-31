import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import { CategoryList } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector } from '../../app/hooks';
import { selectRemoveCategoryLoading } from '../../features/category/CategorySlice';
import { StyledTableRow } from '../../constants';

interface Props {
  category: CategoryList;
  removeCategoryItem: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CategoryItem: React.FC<Props> = ({ category, removeCategoryItem, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveCategoryLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{category.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCategoryItem} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
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
