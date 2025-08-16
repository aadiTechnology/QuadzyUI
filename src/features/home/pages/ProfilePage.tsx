import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, Container, CircularProgress, Snackbar, Alert, Tabs, Tab, Typography, IconButton
} from '@mui/material';
import ProfileHeader from '../components/ProfileHeader';
import ProfileActivity from '../components/ProfileActivity';
import ProfilePostList from '../components/ProfilePostList';
import ProfileSettingsDialog from '../components/ProfileSettingsDialog';
import { fetchUserProfile } from '../services/profileService';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const handle = user.handle;
    if (!handle) {
      setSnackbar({ open: true, message: 'User not found. Please log in.', severity: 'error' });
      setLoading(false);
      return;
    }
    fetchUserProfile(handle)
      .then(setProfile)
      .catch(() => setSnackbar({ open: true, message: 'Failed to load profile.', severity: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const handleSettingsSave = (data: { handle: string; profilePicture?: string }) => {
    setProfile((prev: any) => ({
      ...prev,
      handle: data.handle,
      profilePicture: data.profilePicture,
    }));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.handle = data.handle;
    localStorage.setItem('user', JSON.stringify(user));
    if (data.profilePicture) localStorage.setItem('profilePicture', data.profilePicture);
    setSnackbar({ open: true, message: 'Profile updated.', severity: 'success' });
  };

  const handleDraftClick = (draft: any) => {
    navigate('/lounges/0/new-post', { state: { draft } });
  };

  const handlePostClick = (post: any) => {
    navigate(`/post/${post.postId || post.id}`, { state: { post } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  // Ensure joinYear is valid
  const joinYear = profile.joinYear && profile.joinYear > 2000 ? profile.joinYear : '';

  return (
    <Container maxWidth="sm" sx={{ py: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>
       <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 },  boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff',position: 'sticky',
             top: 0, 
          height: '80vh', 
          overflowY: 'auto',  }} >
      <Button sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' }, }}
                    onClick={() =>  navigate('/home', { replace: true })}
                  >
                    ←
         </Button>
        {/* Settings Icon Top-Right */}
        <IconButton
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon />
        </IconButton>

        {/* Profile Header Centered */}
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={2}>
          <ProfileHeader
            handle={profile.handle}
            collegeName={profile.collegeName}
            collegeEmail={profile.collegeEmail}
            joinYear={joinYear}
            profilePicture={profile.profilePicture}
          />
        </Box>

        {/* Activity Section */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1, textAlign: 'left' }}>
          Activity
        </Typography>
        <ProfileActivity {...profile.activity} />

        {/* Tabs for Posts */}
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mt: 2, mb: 2 }}
        >
          <Tab label="Your Posts" />
          <Tab label="Saved Posts" />
          <Tab label="Draft Posts" />
        </Tabs>
        <Box>
          {tabIndex === 0 && (
            <ProfilePostList
              title=""
              posts={profile.yourPosts}
              onClickPost={handlePostClick}
            />
          )}
          {tabIndex === 1 && (
            <ProfilePostList
              title=""
              posts={profile.savedPosts}
            />
          )}
          {tabIndex === 2 && (
            <ProfilePostList
              title=""
              posts={profile.draftPosts}
              onClickPost={handleDraftClick}
              isDraft
            />
          )}
        </Box>

        <ProfileSettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          profile={{ handle: profile.handle, profilePicture: profile.profilePicture }}
          onSave={handleSettingsSave}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Card>
    </Container>
  );
};

export default ProfilePage;