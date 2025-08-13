import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Card)(
  ({ theme }: { theme: Theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
);

const Footer: React.FC = () => {
  return (
     <FooterWrapper className="footer-wrapper">
    <Box
      component="footer"
      sx={{
        p: 2,
        backgroundColor: 'primary.main',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Typography>
    </Box>
    </FooterWrapper>
  );
};

export default Footer;