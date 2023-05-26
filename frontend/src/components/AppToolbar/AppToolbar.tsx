import React from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import UserMenu from './UserMenu';
import { Link } from 'react-router-dom';
import { selectUser } from '../../features/user/userSlice';
import AnonymousMenu from './AnonymousMenu';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0px 0px 0px' }}>
      <Toolbar>
        <Grid container sx={{ alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
            <Link style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }} to={'/'}>
              Online Shop
            </Link>
          </Typography>
          <Grid item>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
