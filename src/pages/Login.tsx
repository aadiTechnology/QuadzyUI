import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Card, Link, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginUser';
import useAuth from '../hooks/useAuth';
import Fade from '@mui/material/Fade';

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Simple password strength check (you can make it stricter if needed)
const isWeakPassword = (password: string) => password.length < 8;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const { login } = useAuth();

  const clickLogin = async () => {
    setError('');
    // Validation: Empty fields
    if (!email || !password) {
      setError('Please enter your college email and password.');
      return;
    }
    // Validation: Email format
    if (!validateEmail(email)) {
      setError('Please enter a valid college email address.');
      return;
    }
    // Password strength validation
    if (isWeakPassword(password)) {
      setError('Password Strength: Weak');
      return;
    }
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setSuccess(true); // Show success popup
      setTimeout(() => setIsLogin(true), 1200); // Redirect after 1.2s
    } catch (err: any) {
      setError('Incorrect email or password. Please try again.');
    }
  };

  useEffect(() => {
    if (isLogin)  navigate('/home');
  }, [isLogin, navigate]);

  return (
    <>
      <Container sx={{ minHeight: '100vh', display: 'flex',  alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', }} maxWidth={false} >
        <Fade in={true} timeout={700}>
        <Card sx={{ width: 350, mx: 'auto', p: 3, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
          <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, fontWeight: 600 }}>
            Campus Connect
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Log in to your account to continue
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ width: '100%' }}>
            <Typography align="left" sx={{ fontSize: 14, fontWeight: 500, mb: 0.5 }}>
              Email
            </Typography>
            <TextField placeholder="Enter your email" variant="outlined" fullWidth margin="dense" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                bgcolor: '#f5f7fa',
                borderRadius: 2,
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Typography align="left" sx={{ fontSize: 14, fontWeight: 500, mb: 0.5 }}>
              Password
            </Typography>
            <TextField placeholder="Enter your password" type="password" variant="outlined" fullWidth margin="dense" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                bgcolor: '#f5f7fa',
                borderRadius: 2,
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }} 
            />
            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Link href="#" underline="hover" sx={{ fontSize: 13, color: '#888', fontWeight: 500 }}
                onClick={e => {
                  e.preventDefault();
                  navigate('/forgot-password');
                }}
              >
                Forgot Password?
              </Link>
            </Box>
            <Button onClick={clickLogin} variant="contained" color="primary" fullWidth
              sx={{ py: 1.2, fontWeight: 700, fontSize: '1rem', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(60,72,120,0.10)', textTransform: 'none', mb: 2, }} >
              Login
            </Button>
          </Box>
          <Typography sx={{ mt: 2, fontSize: 13, color: '#888', width: '100%', textAlign: 'center', }} >
            Don't have an account?{' '}
            <Link href="#" underline="hover" sx={{ fontWeight: 600 }}
              onClick={e => {
                e.preventDefault();
                navigate('/signup_form');
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Card>
        </Fade>
      </Container>
      <Snackbar
        open={success}
        autoHideDuration={1200}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;