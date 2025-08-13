import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const screens = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/reports', label: 'Reports' },
  {path:'/settings', label: 'Settings Panel'},
];

export default function SidebarMenu({ userRole }: { userRole: string }) {
  // const permissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');

  return (
    <List>
      {screens
        // .filter(screen => (permissions[screen.path] || []).includes(userRole))
        .map(screen => (
          <ListItem button component={Link} to={screen.path} key={screen.path}>
            <ListItemText primary={screen.label} />
          </ListItem>
        ))}
    </List>
  );
}