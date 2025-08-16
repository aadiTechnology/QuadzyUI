import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';

interface ActivityProps {
  karma: number;
  posts: number;
  quads: number;
}

const ProfileActivity: React.FC<ActivityProps> = ({ karma, posts, quads }) => (
  <Card sx={{ p: 2, mb: 3 }}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Box textAlign="center">
          <Typography variant="h6">{karma}</Typography>
          <Typography variant="caption" color="text.secondary">Karma</Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box textAlign="center">
          <Typography variant="h6">{posts}</Typography>
          <Typography variant="caption" color="text.secondary">Posts</Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box textAlign="center">
          <Typography variant="h6">{quads}</Typography>
          <Typography variant="caption" color="text.secondary">Quads</Typography>
        </Box>
      </Grid>
    </Grid>
  </Card>
);

export default ProfileActivity;