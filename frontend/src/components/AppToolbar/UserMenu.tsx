import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { User, UserMutation } from '../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import notImageAvailable from '../../assets/UnknownUser.jpg';
import { apiUrl } from '../../constants';
import { getEditingUser, logout, updateUser } from '../../features/user/userThunks';
import useConfirm from '../Confirm&Alert/useConfirm';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  selectOneUserForEdit,
  selectOneUserForEditError,
  selectOneUserForEditUpdateLoading,
} from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import ModalBody from '../ModalBody';
import UserForm from '../UserForm';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const existingUser = useAppSelector(selectOneUserForEdit);
  const editLoading = useAppSelector(selectOneUserForEditUpdateLoading);
  const error = useAppSelector(selectOneUserForEditError);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { confirm } = useConfirm();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDialog = async () => {
    handleClose();
    await dispatch(getEditingUser(user._id));
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({ id: user._id, user: userToChange })).unwrap();
      setIsDialogOpen(false);
      toast('Profile edited');
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  let cardImage = notImageAvailable;
  if (user.image) {
    cardImage = apiUrl + '/images/' + user.image;
  }
  return (
    <>
      <Button onClick={handleClick} sx={{ color: 'black' }}>
        {user.username}
        <img
          style={{ width: '30px', height: '30px', marginLeft: '13px', borderRadius: '50%' }}
          src={cardImage}
          alt={user.displayName}
        />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={openDialog}>
          <AccountCircleIcon sx={{ mr: 1 }} />
          Edit profile
        </MenuItem>
        {user.role === 'admin' && [
          <MenuItem key="create_product" component={NavLink} to="/create_product">
            <AddCircleIcon sx={{ mr: 1 }} />
            Create Product
          </MenuItem>,
          <MenuItem key="create_category" component={NavLink} to="/create_category">
            <AddCircleIcon sx={{ mr: 1 }} />
            Create Category
          </MenuItem>,
        ]}
        <MenuItem component={NavLink} to="/basket">
          <ShoppingBasketIcon sx={{ mr: 1 }} />
          Basket
        </MenuItem>
        <MenuItem component={NavLink} to="/notes">
          <SpeakerNotesIcon sx={{ mr: 1 }} />
          Notes
        </MenuItem>
        <MenuItem component={NavLink} to="/Notifications">
          <NotificationsIcon sx={{ mr: 1 }} />
          Notifications
        </MenuItem>
        <MenuItem component={NavLink} to="/family">
          <FamilyRestroomIcon sx={{ mr: 1 }} />
          Family
        </MenuItem>
        <MenuItem
          sx={{ color: 'red' }}
          onClick={async () => {
            if (await confirm('Exit', 'Are you sure you want to go out?')) {
              dispatch(logout());
              handleClose();
              navigate('/');
            }
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
      {existingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm error={error} onSubmit={onFormSubmit} existingUser={existingUser} isEdit isLoading={editLoading} />
        </ModalBody>
      )}
    </>
  );
};

export default UserMenu;
