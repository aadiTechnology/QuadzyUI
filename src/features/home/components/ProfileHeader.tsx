import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface ProfileHeaderProps {
  handle: string;
  collegeName: string;
  joinYear: number | string;
  profilePicture?: string;
  onEditPhoto?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  handle, collegeName, joinYear, profilePicture, onEditPhoto
}) => (
  <Box display="flex" flexDirection="column" alignItems="center" width="100%">
    <Avatar
      src={profilePicture}
      sx={{ width: 90, height: 90, mb: 1, cursor: 'pointer' }}
      onClick={onEditPhoto}
    />
    <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {handle}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {collegeName}
    </Typography>
    {joinYear && (
      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        Joined {joinYear}
      </Typography>
    )}
  </Box>
);

export default ProfileHeader;