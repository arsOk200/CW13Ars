import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from './AppToolbar/AppToolbar';
import { Box, Container, CssBaseline } from '@mui/material';
import Footer from './Footer';
import Links from './Links';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <AppToolbar />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container maxWidth={false} sx={{ flexGrow: 1 }}>
          {children}
        </Container>
        <Links />
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
