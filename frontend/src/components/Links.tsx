import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

const Links = () => {
  return (
    <Paper component="footer" square variant="outlined" sx={{ bgcolor: '#eee', mt: 4, minHeight: '40px' }}>
      <Container maxWidth="lg">
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', my: 1 }}></Box>
        <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'black' }}>
            Дополнительная информация 2023@
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Links;
