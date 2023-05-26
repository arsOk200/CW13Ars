import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <>
      <Button component={NavLink} to={'/register'} sx={{ color: 'black' }}>
        Register
      </Button>
      <Button component={NavLink} to={'/login'} sx={{ color: 'black' }}>
        Login
      </Button>
    </>
  );
};

export default AnonymousMenu;
