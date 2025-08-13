import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProfileMenu from './ProfileMenu';

const Header1: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bgcolor: 'primary.main',
        color: '#fff',
        boxShadow: 1,
        height: 64,
        justifyContent: 'center',
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          height: '100%',
        }}
      >
        {/* LEFT: App Name */}
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Quadzy
        </Typography>

        {/* RIGHT: Search Icon and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header1;
