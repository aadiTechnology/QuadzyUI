// Create file: src/features/notifications/NotificationsPage.tsx
import React from 'react';
import {
  Container,
  Typography,
  Card,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'like',
      message: 'John liked your post',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      message: 'Sarah commented on your post',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      message: 'Mike started following you',
      time: '3 hours ago',
      read: true,
    },
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 700 }}>
        Notifications
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <List>
          {notifications.map((notification, index) => (
            <ListItem
              key={notification.id}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={notification.read}
                >
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
};

export default NotificationsPage;