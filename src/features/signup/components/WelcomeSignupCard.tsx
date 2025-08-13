import React from 'react';
import { Box, Typography, Button, Link, Card, Grid, Container } from '@mui/material';

const WelcomeSignupCard: React.FC<{ onSignUp: () => void }> = ({ onSignUp }) => (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', }} >
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' }, }} >
        <Grid item xs={12}>
          <Card sx={{ maxWidth: 500, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', borderRadius: 4,  background: '#fff',  }} >
  
    <Typography variant="h5" fontWeight={700} gutterBottom>
      Welcome to CampusConnect
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      A verified anonymous platform for students.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mb: 2 }}
      onClick={onSignUp}
    >
      Sign Up
    </Button>
    <Typography variant="caption" color="text.secondary">
      By continuing, you agree to our{' '}
      <Link href="/terms" underline="hover">
        Terms of Use
      </Link>{' '}
      and{' '}
      <Link href="/privacy" underline="hover">
        Privacy Policy
      </Link>.
    </Typography>
  </Card>
   </Grid>
   </Grid>
  </Container>
);

export default WelcomeSignupCard;