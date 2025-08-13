import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Button } from '@mui/material';

const roles = ['Admin', 'Teacher', 'User'];
const screens = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/reports', label: 'Reports' },
];

export default function AdminConfig() {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('rolePermissions');
    if (saved) setPermissions(JSON.parse(saved));
  }, []);

  const handleChange = (path: string, selected: string[]) => {
    setPermissions(prev => ({ ...prev, [path]: selected }));
  };

  const handleSave = () => {
    localStorage.setItem('rolePermissions', JSON.stringify(permissions));
    alert('Permissions saved!');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Role-Based Access Configuration</Typography>
      {screens.map(screen => (
        <Box key={screen.path} mb={2}>
          <FormControl fullWidth>
            <InputLabel>{screen.label}</InputLabel>
            <Select
              multiple
              value={permissions[screen.path] || []}
              onChange={e => handleChange(screen.path, e.target.value as string[])}
              renderValue={selected => (selected as string[]).join(', ')}
            >
              {roles.map(role => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={(permissions[screen.path] || []).includes(role)} />
                  <ListItemText primary={role} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
    </Box>
  );
}