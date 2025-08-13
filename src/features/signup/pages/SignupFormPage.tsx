import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Tooltip, IconButton, Alert, Card, Grid, Container, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ClearIcon from '@mui/icons-material/Clear';

import { useNavigate } from 'react-router-dom';
import { College, fetchColleges } from '../services/CollegeService';
import CollegeSelect from '../components/CollegeSelec';
import { requestOtp } from '../services/otpService';
import api from '../../../services/api';
import Fade from '@mui/material/Fade';

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignupFormPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [testOtpState, setTestOtp] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges().then(setColleges);
  }, []);

  const handleContinue = async () => {
    setError('');
    if (!collegeId) {
      setError('Please select your college.');
      return;
    }
    if (!email) {
      setError('Please enter your college email.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const selectedCollege = colleges.find(c => String(c.id) === String(collegeId));
    if (selectedCollege && !email.endsWith(`@${selectedCollege.domain}`)) {
      setError("Email domain doesn't match selected college. Please check and try again.");
      return;
    }
    setLoading(true);
    try {
      // Register user with email and collegeId only
      await api.post('/auth/signup/register', { email, collegeId: Number(collegeId) });

      // Request OTP
      const response = await requestOtp(Number(collegeId), email);
      setTestOtp(response.data.otp); // Save OTP for testing
      setLoading(false);
      localStorage.setItem('collegeId', collegeId);
      if (selectedCollege) {
        localStorage.setItem('collegeName', selectedCollege.name);
      }
      navigate('/signup/verify', { state: { email, college_id: Number(collegeId), testOtp: response.data.otp } });
    } catch (err: any) {
      setLoading(false);
      setError('An account with this email already exists.');
    }
  };

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'auto', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', }} >
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' }, }} >
        <Grid item xs={12}>
          <Fade in={true} timeout={700}>
          <Card sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', borderRadius: 4,  background: '#fff',  }} >
            <Button sx={{ position: 'absolute', left: 30, top: 24, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#e3eafc' }, }}
              onClick={() => navigate(-1)}
            >
              ←
            </Button>
            <Box sx={{ maxWidth: 400, mx: 'auto', p: { xs: 1, md: 2 } }}>
              <Typography  variant="h6" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }} >
                Join the community
              </Typography>
              <CollegeSelect
                colleges={colleges}
                value={collegeId}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCollegeId(e.target.value)}
              />
              <Box display="flex" alignItems="center">
                <TextField 
                  label="College email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: email && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setEmail('')}
                          edge="end"
                          size="small"
                          sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: '#f5f7fa',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)', // Match the college select label color
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1976d2', // Focused state color
                    },
                  }} 
                />
                
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                  width: '100%',
                  textAlign: 'left',
                  bgcolor: '#f5f7fa',
                  p: 1,
                  borderRadius: 2,
                  fontSize: '0.95rem',
                }}
              >
                We only use your college email to verify your identity. It will never be shared or displayed. Your email is only used for login. This app is fully anonymous — your profile stays anonymous.
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              <Button variant="contained" color="primary" fullWidth onClick={handleContinue} disabled={loading}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px 0 rgba(60,72,120,0.10)',
                  mt: 1,
                  textTransform: 'none',
                }}
              >
                Continue
              </Button>
            </Box>
          </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
    
  );
};

export default SignupFormPage;