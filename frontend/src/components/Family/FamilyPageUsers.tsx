import React from 'react';
import { StyledTableRow } from '../../constants';
import { IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
interface Props {
  user: User;
  Leave: React.MouseEventHandler;
}

const FamilyPageUsers: React.FC<Props> = ({ user, Leave }) => {
  const CurentUser = useAppSelector(selectUser);
  let buttons;

  if (user._id === CurentUser?._id) {
    buttons = (
      <IconButton aria-label="delete" onClick={Leave}>
        <DeleteIcon />
      </IconButton>
    );
  }
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{user.displayName}</TableCell>
        <TableCell align="right">{buttons}</TableCell>
      </StyledTableRow>
    </>
  );
};

export default FamilyPageUsers;
