import React from 'react';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext'; // <-- import your AuthProvider
import AppRouter from './router/AppRouter';

const App = () => (
  <CustomThemeProvider>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </CustomThemeProvider>
);

export default App;