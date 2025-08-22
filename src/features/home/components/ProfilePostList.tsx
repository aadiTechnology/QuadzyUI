import React from 'react';
import { Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '@services/authService';

interface PostItem {
  postId?: number;
  id?: number;
  title: string;
  description: string;
  createdAt?: string;
  last_edited?: string;
  thumbnail?: string | null;
  timeAgo: string;
  handle?: string;
  collegeName?: string;
}

interface ProfilePostListProps {
  title: string;
  posts: PostItem[];
  onClickPost?: (post: PostItem) => void;
  isDraft?: boolean;
  noCard?: boolean;
}

const ProfilePostList: React.FC<ProfilePostListProps> = ({ title, posts, onClickPost, isDraft }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const currentUserHandle = user ? JSON.parse(user).handle : '';

  return (
    <Box>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{title}</Typography>
      )}
      <List>
        {posts.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>No posts found.</Typography>
        )}
        {posts.map(post => {
          // Prefer userHandle, fallback to handle
          const handle = post.handle || post.handle || '';
          const college = post.collegeName || post.collegeName || '';
          const timeAgo = post.timeAgo || '';

          return (
            <ListItem
              key={post.postId || post.id}
              component="button"
              onClick={() => onClickPost && onClickPost(post)}
              sx={{
                borderRadius: 2,
                mb: 1,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                "&:hover": { bgcolor: onClickPost ? "#f5f7fa" : undefined }
              }}>
              <ListItemAvatar>
                <Avatar variant="rounded" src={post.thumbnail || undefined}>
                  {post.title[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                    <Box display="flex" alignItems="flex-start" gap={1} flex={1} sx={{ mb: 0.5 }}>
        <PersonIcon fontSize="medium" color="action" sx={{ mt: 0.5 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
            {post.handle || "userHandle"}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.1 }}>
              {post.collegeName || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {post.description}
                  </Typography>
                }
              />
              {isDraft && post.last_edited && (
                <Typography variant="caption" color="warning.main" sx={{ ml: 2 }}>
                  Last edited: {new Date(post.last_edited).toLocaleString()}
                </Typography>
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ProfilePostList;