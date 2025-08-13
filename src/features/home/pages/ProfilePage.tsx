// Create file: src/features/home/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Card,
  Button,
  Grid,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import TopPosts from '../components/TopPosts'; // Import the new component

interface UserProfile {
  handle: string;
  email: string;
  collegeName: string;
  collegeId: number | null;
  profilePicture?: string;
  joinedDate: string;
  postsCount: number;
  likesCount: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const userHandle = localStorage.getItem('user');
      const collegeName = localStorage.getItem('collegeName');
      const email = localStorage.getItem('email');
      const collegeId = localStorage.getItem('collegeId');
      
      if (userHandle) {
        const parsedUser = JSON.parse(userHandle);
        const userProfile: UserProfile = {
          handle: parsedUser.handle || '@user',
          email: email || 'user@college.edu',
          collegeName: collegeName || 'Your College',
          collegeId: collegeId ? parseInt(collegeId) : null,
          profilePicture: localStorage.getItem('profilePicture') ?? undefined,
          joinedDate: '2024',
          postsCount: 0,
          likesCount: 0,
        };
        setProfile(userProfile);
        setNewHandle(userProfile.handle);
        setProfilePicture(userProfile.profilePicture ?? null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
        localStorage.setItem('profilePicture', result);
        if (profile) {
          setProfile({ ...profile, profilePicture: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateHandle = () => {
    if (profile && newHandle.trim()) {
      const updatedProfile = { ...profile, handle: newHandle };
      setProfile(updatedProfile);
      
      // Update localStorage
      const userHandle = localStorage.getItem('user');
      if (userHandle) {
        const parsedUser = JSON.parse(userHandle);
        parsedUser.handle = newHandle;
        localStorage.setItem('user', JSON.stringify(parsedUser));
        localStorage.setItem('userHandle', newHandle);
      }
      
      setEditDialogOpen(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicture(null);
    localStorage.removeItem('profilePicture');
    if (profile) {
      setProfile({ ...profile, profilePicture: undefined });
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          sx={{
            position: 'absolute',
            left: 30,
            top: 89,
            minWidth: 36,
            borderRadius: 2,
            bgcolor: '#f5f7fa',
            color: '#000',
            fontWeight: 700,
            boxShadow: 0,
            '&:hover': { bgcolor: '#e3eafc' },
          }}
          onClick={() => navigate(-1)}
        >
          ←
        </Button>
        <Typography variant="h6" align="center" sx={{ width: '100%', fontWeight: 700 }}>
          Profile
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
        {/* Profile Picture Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                bgcolor: profilePicture ? 'transparent' : 'primary.main',
                fontSize: '3rem',
              }}
              src={profilePicture || undefined}
            >
              {!profilePicture && <PersonIcon sx={{ fontSize: '4rem' }} />}
            </Avatar>
            
            {/* Photo Upload Button */}
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 16,
                right: -8,
                bgcolor: 'primary.main',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
              component="label"
            >
              <CameraAltIcon fontSize="small" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </IconButton>
          </Box>

          {/* Remove Photo Button */}
          {profilePicture && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRemovePhoto}
              sx={{ mb: 2 }}
            >
              Remove Photo
            </Button>
          )}

          {/* Handle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {profile.handle}
            </Typography>
            <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Information */}
        <Grid container spacing={2}>
          {/* <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <SchoolIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  College
                </Typography>
                <Typography variant="body1">{profile.collegeName}</Typography>
              </Box>
            </Box>
          </Grid> */}

          {/* <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </Box>
            </Box>
          </Grid> */}

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {profile.postsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {profile.likesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Likes
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Top Posts Section */}
      <Box sx={{ mb: 3 }}>
        <TopPosts 
          userCollegeId={profile.collegeId} 
          userHandle={profile.handle} 
        />
      </Box>

      {/* Additional Actions */}
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
          Account Actions
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 1, justifyContent: 'flex-start' }}
          onClick={() => {
            // Add settings navigation
            console.log('Navigate to settings');
          }}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 1, justifyContent: 'flex-start' }}
          onClick={() => {
            // Add privacy navigation
            console.log('Navigate to privacy');
          }}
        >
          Privacy
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
          onClick={() => {
            // Logout functionality
            localStorage.clear();
            navigate('/login');
          }}
        >
          Logout
        </Button>
      </Card>

      {/* Edit Handle Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Handle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Handle"
            fullWidth
            variant="outlined"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            placeholder="@yourhandle"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateHandle} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;