// Create file: src/features/home/components/TopPosts.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Skeleton,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { fetchPosts } from '../services/loungeService';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  userHandle: string;
  institution: string;
  timeAgo: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
  isPrivate: boolean;
  liked: boolean;
}

interface TopPostsProps {
  userCollegeId: number | null;
  userHandle: string;
}

const TopPosts: React.FC<TopPostsProps> = ({ userCollegeId, userHandle }) => {
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopPosts();
  }, [userCollegeId, userHandle]);

  const loadTopPosts = async () => {
    if (!userCollegeId) return;
    
    setLoading(true);
    try {
      const response = await fetchPosts(userCollegeId);
      const posts = response.data || [];
      
      // Filter posts by current user and sort by likes + comments
      const userPosts = posts
        .filter((post: any) => post.userHandle === userHandle || post.handle === userHandle)
        .map((post: any) => ({
          ...post,
          id: post.id ?? post.postId,
        }))
        .sort((a: any, b: any) => {
          const scoreA = (a.likes || 0) + (a.comments || 0);
          const scoreB = (b.likes || 0) + (b.comments || 0);
          return scoreB - scoreA;
        })
        .slice(0, 2); // Get top 2 posts

      setTopPosts(userPosts);
    } catch (error) {
      console.error('Error loading top posts:', error);
      setTopPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  if (loading) {
    return (
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Top Posts
        </Typography>
        {[1, 2].map((index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width="80%" height={24} />
          </Box>
        ))}
      </Card>
    );
  };

  if (topPosts.length === 0) {
    return (
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Top Posts
        </Typography>
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No posts yet. Create your first post to see it here!
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Top Posts
      </Typography>
      
      {topPosts.map((post, index) => (
        <Box
          key={post.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: index < topPosts.length - 1 ? 2 : 0,
            cursor: 'pointer',
            p: 1,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          onClick={() => handlePostClick(post)}
        >
          {/* Small Avatar Icon */}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              flexShrink: 0,
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>

          {/* Post Title */}
          <Typography
            variant="subtitle1"
            fontWeight="600"
            sx={{
              lineHeight: 1.3,
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {post.title}
          </Typography>
        </Box>
      ))}
    </Card>
  );
};

export default TopPosts;