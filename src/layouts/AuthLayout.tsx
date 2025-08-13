import React from 'react';
import { Container } from '@mui/material';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container component="main" maxWidth="xs">
      {children}
    </Container>
  );
};

export default AuthLayout;