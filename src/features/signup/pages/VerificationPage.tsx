import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Alert, Card, Grid, Container } from '@mui/material';
import OtpInput from '../components/OtpInput';
import { verifyOtp, requestOtp } from '../services/otpService';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api'; // Add this import
import Fade from '@mui/material/Fade';
const OTP_LENGTH = 6;
const OTP_EXPIRY = 120; // seconds

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get email and college_id from location.state (passed from previous page)
  const { email, college_id, testOtp: initialTestOtp } = (location.state || {}) as { email: string; college_id: number; testOtp?: string };

  const [testOtp, setTestOtp] = useState<string | undefined>(initialTestOtp);
  const [showTestOtp, setShowTestOtp] = useState(!!initialTestOtp); // Show only if coming from signup, not back navigation
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [triesLeft, setTriesLeft] = useState(3);
  const [timer, setTimer] = useState(OTP_EXPIRY);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimer(OTP_EXPIRY);
    setCanResend(false);
    // Hide testOtp if user navigated back (no initialTestOtp)
    if (!initialTestOtp) setShowTestOtp(false);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const handleVerify = async () => {
    setError('');
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      const userId = Number(response.data.user_id);
      setLoading(false);
      navigate('/signup/handle', { state: { userId, email } });
    } catch (err: any) {
      setLoading(false);
      
      // Check if backend suggests showing resend button
      const showResend = err.response?.headers?.['x-show-resend'] === 'true';
      
      setTriesLeft(prev => {
        const newTries = prev - 1;
        if (newTries <= 0 || showResend) {
          setCanResend(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return newTries;
      });

      // Error message logic based on attempts
      if (triesLeft === 3) {
        // First attempt - show simple "Invalid code"
        setError('Invalid code');
      } else if (triesLeft - 1 <= 0) {
        // No attempts left
        setError('Maximum attempts reached. Please request a new code.');
      } else {
        // Show attempts remaining
        setError(`Invalid code. You have ${triesLeft - 1} attempts left.`);
      }
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(''); // Clear the old OTP input
    setTriesLeft(3);
    setCanResend(false);
    setTimer(OTP_EXPIRY);

    // Restart timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);

    // Request new OTP and update testOtp if present
    try {
      const response = await requestOtp(college_id, email);
      // Clear the old OTP and set the new one
      setOtp(''); // Make sure OTP input is cleared
      setTestOtp(response.data.testOtp || response.data.otp || '');
      setShowTestOtp(true); // Show test OTP after resend
      
      // Optional: Show success message
      // setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  const isExpired = timer <= 0;

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', }} >
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' }, }} >
        <Grid item xs={12}>
          <Fade in={true} timeout={700}>
          <Card sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', borderRadius: 4,  background: '#fff',  }} >
      <Button sx={{ position: 'absolute', left: 30, top: 24, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#e3eafc' }, }}
                    onClick={() => navigate(-1)}
                  >
        ←
      </Button>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Enter the code
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        We sent a 6-digit code to your email. The code expires in 2 minutes.
        {showTestOtp && testOtp && (
          <Box sx={{ mt: 1 }}>
            <Typography color="primary" fontWeight={700}>
              [Test OTP: {testOtp}]
            </Typography>
          </Box>
        )}
      </Typography>
      <OtpInput value={otp} onChange={setOtp} length={OTP_LENGTH} disabled={triesLeft <= 0 || isExpired || loading} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleVerify}
        disabled={loading || isExpired || triesLeft <= 0}
      >
        Verify Code
      </Button>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleResend}
          disabled={!canResend}
        >
          Resend Code
        </Button>
        <Typography variant="body2" color="text.secondary">
          {timer > 0 ? `0${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Expired'}
        </Typography>
      </Box>
    </Card>
    </Fade>
    </Grid>
  </Grid>
  </Container>
  );
};

export default VerificationPage;