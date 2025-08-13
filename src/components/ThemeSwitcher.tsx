import React from 'react';
import { useThemeMode } from '../contexts/ThemeContext';
import { Select, MenuItem } from '@mui/material';

const ThemeSwitcher: React.FC = () => {
  const { themeName, setThemeName } = useThemeMode();

  return (
    <Select
      value={themeName}
      onChange={e => setThemeName(e.target.value as any)}
      size="small"
      sx={{ color: 'inherit', minWidth: 100 }}
    >
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
      <MenuItem value="blue">Blue</MenuItem>
      <MenuItem value="green">Green</MenuItem>
      <MenuItem value="purple">Purple</MenuItem>
    </Select>
  );
};

export default ThemeSwitcher;