import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Paper component="footer" square variant="outlined" sx={{ padding: '30px', bgcolor: 'black', minHeight: '300px' }}>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', my: 1 }}></Box>
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            Дополнительная информация 2023@
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
