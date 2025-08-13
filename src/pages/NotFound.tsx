import React from 'react';
import { Box, Typography, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top-right corner buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button variant="outlined" color="inherit" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Box>
      

      {/* Centered 404 message */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          gutterBottom
          sx={{ color: '#fff', textShadow: '2px 2px 8px #000' }}
        >
        Welcome to CampusConnect
        </Typography>
        {/* <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          sx={{ color: '#fff', textShadow: '1px 1px 6px #000' }}
        >
          Page Not Found
        </Typography>

        <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
          Go to Home
        </Button> */}
      </Box>
    </Box>
  );
};

export default NotFound;
