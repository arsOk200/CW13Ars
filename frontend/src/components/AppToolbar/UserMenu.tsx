import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { User } from '../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import notImageAvailable from '../../assets/UnknownUser.jpg';
import { apiUrl } from '../../constants';
import { logout } from '../../features/user/userThunks';
import useConfirm from '../Confirm&Alert/useConfirm';
import Divider from '@mui/material/Divider';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { confirm } = useConfirm();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let cardImage = notImageAvailable;
  if (user.image) {
    cardImage = apiUrl + '/images/' + user.image;
  }

  if (user.googleId && user.image) {
    cardImage = user.image;
  }
  return (
    <>
      <Button onClick={handleClick} sx={{ color: 'black' }}>
        {user.displayName}
        <img
          style={{ width: '30px', height: '30px', marginLeft: '13px', borderRadius: '50%' }}
          src={cardImage}
          alt={user.displayName}
        />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <AccountCircleIcon sx={{ mr: 1 }} />
          Edit profile
        </MenuItem>
        {user.role === 'user' ? (
          <MenuItem component={NavLink} to="/new-track">
            <AddCircleIcon sx={{ mr: 1 }} />
            Create Product&Category
          </MenuItem>
        ) : (
          ''
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem component={NavLink} to="/new-artist">
          <ShoppingBasketIcon sx={{ mr: 1 }} />
          Basket
        </MenuItem>
        <MenuItem component={NavLink} to="/new-album">
          <SpeakerNotesIcon sx={{ mr: 1 }} />
          Notes
        </MenuItem>
        <MenuItem component={NavLink} to="/new-album">
          <NotificationsIcon sx={{ mr: 1 }} />
          Notifications
        </MenuItem>
        <MenuItem component={NavLink} to="/new-track">
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
    </>
  );
};

export default UserMenu;
