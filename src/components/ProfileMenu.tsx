import React, { useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('collegeId');
    localStorage.removeItem('collegeName');
    localStorage.removeItem('userHandle');
    localStorage.removeItem('profilePicture');
    window.location.href = '/login';
  };

  const navigateToProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const getUserHandle = () => {
    try {
      const userHandle = localStorage.getItem('user');
      const parsedUser = userHandle ? JSON.parse(userHandle) : null;
      return parsedUser?.handle || 'User';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return 'User';
    }
  };

  const getProfilePicture = () => {
    return localStorage.getItem('profilePicture');
  };

  const userHandle = getUserHandle();
  const profilePicture = getProfilePicture();

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar
          sx={{ width: 40, height: 40 }}
          src={profilePicture || undefined}
        >
          {!profilePicture && <PersonIcon />}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: { borderRadius: 2, minWidth: 220 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} py={1}>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={profilePicture || undefined}
            >
              {!profilePicture && <PersonIcon />}
            </Avatar>
            <Box ml={1}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                {userHandle}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={navigateToProfile}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
