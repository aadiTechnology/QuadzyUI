import React, { useState } from 'react';
import Fade from '@mui/material/Fade';
import { Box, Typography, Card, Button, Checkbox, FormControlLabel, Grid, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email, handle } = (location.state || {}) as { userId: number; email: string; handle: string };

  const [checked, setChecked] = useState(false);

  const handleContinue = () => {
    if (!checked) return;
    navigate('/signup/set-password', { state: { userId, email, handle } });
  };

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' } }}>
        <Grid item xs={12}>
          <Fade in={true} timeout={700}>
          <Card sx={{ maxWidth: 400, mx: 'auto', p: { xs: 2, md: 3 }, borderRadius: 4, background: '#fff', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)' }}>
            <Button sx={{ position: 'absolute', left: 30, top: 24, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#e3eafc' } }} onClick={() => navigate(-1)}>
              ←
            </Button>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom align="center">
              Terms & Conditions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Welcome to our platform! Before you proceed, please take a moment to review our Privacy Policy and Terms of Use. These documents outline the rules and guidelines for using our services, as well as how we handle your personal information. By continuing, you agree to abide by these terms. If you have any questions or concerns, please contact us at support@studentconnect.com.
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />}
              label="I agree to the Privacy Policy and Terms of Use"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 3, fontWeight: 700, py: 1.2, fontSize: '1rem', boxShadow: '0 2px 8px 0 rgba(60,72,120,0.10)' }}
              onClick={handleContinue}
              disabled={!checked}
            >
              Continue
            </Button>
          </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TermsPage;