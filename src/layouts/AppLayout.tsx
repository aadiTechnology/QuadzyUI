import React from 'react';
import { Box, CssBaseline, Grid, Container } from '@mui/material';
import Header from '../components/ProfileMenu';
import Footer from '../components/Footer';
import Header1 from '../components/Header1';
import StickyFooter from '../features/home/components/StickyFooter'; // Import the new component

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box>
          <Header1 />
        </Box>

        {/* Main content area with responsive Container and Grid */}
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            pt: '64px', // Add padding-top equal to header height
            pb: '70px', // Keep padding-bottom for sticky footer
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            overflow={'auto'}
            sx={{
              minHeight: '60vh',
              flex: 1, // Allow content to grow
            }}
          >
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </Container>

        {/* Sticky Footer Navigation */}
        <StickyFooter />
        {/* Original Footer */}
        <Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
