import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Paper component="footer" square variant="outlined" sx={{ padding: '30px', bgcolor: 'black', minHeight: '200px' }}>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', my: 1 }}>
          <ShoppingBasketIcon fontSize="large" sx={{ color: 'white', marginRight: '5px' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>
            ONLINE SHOP
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            <Link
              style={{ color: 'white', fontWeight: 'bold', marginRight: '5px' }}
              to={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            >
              More Information
            </Link>
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', my: 1 }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            2023@
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
