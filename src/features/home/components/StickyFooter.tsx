// Create file: src/components/StickyFooter.tsx
import React from 'react';
import { Box, IconButton, Typography, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const StickyFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: <HomeIcon />,
      label: 'Home',
      path: '/home',
    },
    {
      icon: <MessageIcon />,
      label: 'Message',
      path: '/messages',
    },
    {
      icon: <NotificationsIcon />,
      label: 'Notification',
      path: '/notifications',
      badge: 3, // Example badge count
    },
    {
      icon: <SettingsIcon />,
      label: 'Setting',
      path: '/settings',
    },
  ];

  // Don't show footer on certain pages
  const hiddenPages = ['/login', '/signup', '/signup_form', '/signup/verify', '/signup/handle', '/signup/terms', '/signup/set-password'];
  const shouldHideFooter = hiddenPages.some(page => location.pathname.startsWith(page));

  if (shouldHideFooter) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        py: 1,
        px: 1,
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        height: 70,
      }}
    >
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path ||
          (item.path === '/home' && location.pathname === '/');

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 60,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => navigate(item.path)}
          >
            <IconButton
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                p: 0.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {item.badge ? (
                <Badge
                  badgeContent={item.badge}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                color: isActive ? 'primary.main' : 'text.secondary',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.65rem',
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default StickyFooter;