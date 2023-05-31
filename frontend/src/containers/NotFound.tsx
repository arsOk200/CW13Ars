import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Typography component="h1" variant="h1">
        Page Not Found!
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h3">
          <Link style={{ color: '#000', fontWeight: 'bold' }} to={'/'}>
            Go Back
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default NotFound;
