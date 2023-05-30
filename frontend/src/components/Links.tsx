import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import MailIcon from '@mui/icons-material/Mail';

const Links = () => {
  return (
    <Paper component="footer" square variant="outlined" sx={{ bgcolor: '#eee', mt: 4, minHeight: '40px' }}>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', my: 1 }}></Box>
        <Box sx={{ flexGrow: 1, justifyContent: 'start', display: 'flex', mb: 2 }}>
          <Link
            style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', marginRight: '5px' }}
            to={'https://www.instagram.com/'}
          >
            <InstagramIcon fontSize="large" />
          </Link>
          <Link
            style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', marginRight: '5px' }}
            to={'https://ru-ru.facebook.com/'}
          >
            <FacebookIcon fontSize="large" />
          </Link>
          <Link
            style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', marginRight: '5px' }}
            to={'https://twitter.com/?lang=ru'}
          >
            <TwitterIcon fontSize="large" />
          </Link>
          <Link
            style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', marginRight: '5px' }}
            to={'https://www.google.com/intl/ru/gmail/about/'}
          >
            <MailIcon fontSize="large" />
          </Link>
        </Box>
      </Container>
    </Paper>
  );
};

export default Links;
