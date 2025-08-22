import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar, Box, Typography } from '@mui/material';

interface ProfileSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  profile: {
    handle: string;
    profilePicture?: string;
  };
  onSave: (data: { handle: string; profilePicture?: string }) => void;
}

const ProfileSettingsDialog: React.FC<ProfileSettingsDialogProps> = ({ open, onClose, profile, onSave }) => {
  const [handle, setHandle] = useState(profile.handle);
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!handle.trim()) {
      setError('Handle is required');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(handle)) {
      setError('Handle must be 3-20 characters, letters/numbers/underscores only');
      return;
    }
    setError('');
    // Update localStorage with new handle and profilePicture
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...user,
      handle,
      profilePicture,
    }));
    onSave({ handle, profilePicture });
    onClose();
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setProfilePicture(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={profilePicture} sx={{ width: 56, height: 56 }} />
          <Button variant="outlined" component="label">
            Change Picture
            <input type="file" hidden accept="image/*" onChange={handlePictureChange} />
          </Button>
        </Box>
        <TextField
          label="Handle"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileSettingsDialog;