import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f5f5f5', minHeight: '100vh', width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Little Star! 🌟
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Here’s what’s happening today at your preschool.
      </Typography>

      <Grid container spacing={3} mt={2}>
        {/* Attendance */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <SchoolIcon color="primary" fontSize="large" />
              <Typography variant="h6" mt={1}>
                Attendance
              </Typography>
              <Typography variant="body2">
                Present today ✅
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Homework */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <AssignmentIcon color="secondary" fontSize="large" />
              <Typography variant="h6" mt={1}>
                Homework
              </Typography>
              <Typography variant="body2">
                Color the fruit 🍎 worksheet
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <NotificationsActiveIcon color="error" fontSize="large" />
              <Typography variant="h6" mt={1}>
                Announcement
              </Typography>
              <Typography variant="body2">
                Picnic on Friday! 🧺
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <EventIcon color="success" fontSize="large" />
              <Typography variant="h6" mt={1}>
                Events
              </Typography>
              <Typography variant="body2">
                Parent-Teacher Meeting 📅 Jun 15
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
