import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface ProfileHeaderProps {
  handle: string;
  collegeName: string;
  collegeEmail: string;
  joinYear: number | string;
  profilePicture?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  handle, collegeName, collegeEmail, joinYear, profilePicture
}) => (
  <Box display="flex" flexDirection="column" alignItems="center" width="100%">
    <Avatar src={profilePicture} sx={{ width: 90, height: 90, mb: 1 }} />
    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {handle}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {collegeName}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {collegeEmail}
    </Typography>
    {joinYear && (
      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        Joined {joinYear}
      </Typography>
    )}
  </Box>
);

export default ProfileHeader;