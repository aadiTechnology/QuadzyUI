import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  lightTheme,
  darkTheme,
  blueTheme,
  greenTheme,
  purpleTheme,
} from '../assets/theme';

type ThemeName = 'light' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeContextProps {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  themeName: 'light',
  setThemeName: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

const themeMap: Record<ThemeName, any> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
};

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const theme = useMemo(() => themeMap[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};