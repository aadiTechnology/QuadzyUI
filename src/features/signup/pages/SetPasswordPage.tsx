import React, { useState } from 'react';
import Fade from '@mui/material/Fade';
import { Box, Typography, Button, Card, Alert, Grid, Container } from '@mui/material';
import PasswordField from '../components/PasswordField';
import { setPassword } from '../services/passwordService';
import { useNavigate, useLocation } from 'react-router-dom';

const validatePassword = (password: string) => {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/\d/.test(password)) return 'Password must include at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character.';
  return '';
};

const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email, handle } = (location.state || {}) as { userId: number; email: string; handle: string };

  const [password, setPasswordValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRealtimeValidation, setShowRealtimeValidation] = useState(true);

  // Real-time validation messages (shown while typing)
  const getRealtimePasswordError = () => {
    if (!password || !showRealtimeValidation) return '';
    return validatePassword(password);
  };

  const getRealtimeConfirmError = () => {
    if (!confirm || !showRealtimeValidation) return '';
    if (password !== confirm) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async () => {
    setShowRealtimeValidation(false); // Hide real-time validation
    setError('');
    
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError); // Show backend-style error
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    try {
      await setPassword(userId, password);
      setLoading(false);
      navigate('/home', { state: { handle } });
    } catch (err: any) {
      setLoading(false);
      setError('Failed to set password. Please try again.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
    setShowRealtimeValidation(true); // Re-enable real-time validation when typing
    setError(''); // Clear submit errors when typing
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    setShowRealtimeValidation(true); // Re-enable real-time validation when typing
    setError(''); // Clear submit errors when typing
  };

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', }} >
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' }, }} >
        <Grid item xs={12}>
          <Fade in={true} timeout={700}>
          <Card sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', borderRadius: 4,  background: '#fff',  }} >
            <Button sx={{ position: 'absolute', left: 30, top: 24, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#e3eafc' }, }}
              onClick={() => navigate(-4)}
            >
              ←
            </Button>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Set your password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Min 8 characters, must include 1 number and 1 special character.
      </Typography>
      <PasswordField
        label="New Password"
        value={password}
        onChange={handlePasswordChange}
        error={getRealtimePasswordError()}
      />
      <PasswordField
        label="Confirm Password"
        value={confirm}
        onChange={handleConfirmChange}
        error={getRealtimeConfirmError()}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        Submit
      </Button>
    </Card>
    </Fade>
     </Grid>
    </Grid>
    </Container>
  );
};

export default SetPasswordPage;