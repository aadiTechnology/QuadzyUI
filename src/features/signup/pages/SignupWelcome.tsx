import React from 'react';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import WelcomeSignupCard from '../components/WelcomeSignupCard';

const SignupWelcome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Fade in={true} timeout={800}>
      <div>
        <WelcomeSignupCard onSignUp={() => navigate('/signup_form')} />
      </div>
    </Fade>
  );
};

export default SignupWelcome;