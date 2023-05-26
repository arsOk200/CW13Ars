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
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem component={NavLink} to="/track-history"></MenuItem>
        <MenuItem component={NavLink} to="/new-artist">
          корзина
        </MenuItem>
        <MenuItem component={NavLink} to="/new-album">
          семья
        </MenuItem>
        <MenuItem component={NavLink} to="/new-track">
          настройки
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (await confirm('Exit', 'Are you sure you want to go out?')) {
              dispatch(logout());
              handleClose();
              navigate('/');
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
