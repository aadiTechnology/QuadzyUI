import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

interface ActivityProps {
  karma: number;
  posts: number;
  quads: number;
}

const ProfileActivity: React.FC<ActivityProps> = ({ karma, posts, quads }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={4}>
      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f5f7fa' }}>
        <Typography variant="h6">{karma}</Typography>
        <Typography variant="caption" color="text.secondary">Karma</Typography>
      </Paper>
    </Grid>
    <Grid item xs={4}>
      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f5f7fa' }}>
        <Typography variant="h6">{posts}</Typography>
        <Typography variant="caption" color="text.secondary">Posts</Typography>
      </Paper>
    </Grid>
    <Grid item xs={4}>
      <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: '#f5f7fa' }}>
        <Typography variant="h6">{quads}</Typography>
        <Typography variant="caption" color="text.secondary">Quads</Typography>
      </Paper>
    </Grid>
  </Grid>
);

export default ProfileActivity;