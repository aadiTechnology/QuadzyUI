import React from 'react';
import { Card, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';

interface PostItem {
  postId?: number;
  id?: number;
  title: string;
  description: string;
  createdAt?: string;
  last_edited?: string;
  thumbnail?: string | null;
  timeAgo: string;
}

interface ProfilePostListProps {
  title: string;
  posts: PostItem[];
  onClickPost?: (post: PostItem) => void;
  isDraft?: boolean;
}

const ProfilePostList: React.FC<ProfilePostListProps> = ({ title, posts, onClickPost, isDraft }) => (
  <Box>
    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{title}</Typography>
    <List>
      {posts.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>No posts found.</Typography>
      )}
      {posts.map(post => (
       <ListItem
            key={post.postId || post.id}
            component="button"
             onClick={() => onClickPost && onClickPost(post)}
               sx={{
                  borderRadius: 2,
                   mb: 1,
                   "&:hover": { bgcolor: onClickPost ? "#f5f7fa" : undefined }
                }}>
          <ListItemAvatar>
            <Avatar variant="rounded" src={post.thumbnail || undefined}>
              {post.title[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2" fontWeight={600}>{post.title}</Typography>
                <Typography variant="caption" color="text.secondary">{post.timeAgo}</Typography>
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
      ))}
    </List>
  </Box>
);

export default ProfilePostList;