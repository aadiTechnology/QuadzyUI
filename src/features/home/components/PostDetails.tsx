import React, { useEffect } from 'react';
import { Box, Button,Typography, IconButton, Tooltip,Card, Container, CircularProgress } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CommentSection from './CommentDrawer'; // Import the updated CommentDrawer component
import { fetchComments } from '../services/loungeService'; // Import fetchComments service
import '../../../styles/transition.css'; // Import transition styles
import Chip from '@mui/material/Chip';

export interface Post {
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

interface Comment {
  commentId: number;
  parentId?: number | null; // <-- Add this line
  userHandle: string;
  content: string;
  timeAgo: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
  attachments?: string[];
  createdAt: string; // ISO string from backend
}

function nestComments(flatComments: Comment[]): Comment[] {
  const map = new Map<number, Comment & { replies: Comment[] }>();
  const roots: Comment[] = [];

  flatComments.forEach(c => {
    map.set(c.commentId, { ...c, replies: c.replies || [] });
  });

  map.forEach(comment => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

const PostDetails: React.FC = () => {
  const location = useLocation();
   const navigate = useNavigate();
  const post = location.state?.post;

  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Fetch comments when the component mounts
  React.useEffect(() => {
    if (post) {
      setLoading(true);
      fetchComments(post.id)
        .then(res => setComments(nestComments(res.data)))
        .finally(() => setLoading(false));
    }
  }, [post]);

  if (!post) {
    return <Typography variant="h6">Post not found</Typography>;
  }

  return (
    <Box sx={{ position: 'relative',  minHeight: '100vh',  pb: { xs: 10, md: 10 }, }} >
           <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 },  boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff',position: 'sticky',
                 top: 0, 
              height: '80vh', 
              overflowY: 'auto',  }} >
        <Button sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' }, }}
                           onClick={() => navigate(-1)}
                         >
                           ←
             </Button>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              View Post
      
            </Typography>
     
      <Box className="screen-transition-enter" sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Content Section */}
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
          <PersonIcon fontSize="small" color="action"/>
          <Typography variant="subtitle2">
            {post.userHandle} ({post.institution})
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          {post.title}
        </Typography>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {post.tags.map((tag: string) => (
              <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#f3f6f9', fontWeight: 500 }} />
            ))}
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.description}
        </Typography>
        <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
          <Tooltip title="Like">
            <IconButton size="small" color={post.liked ? 'primary' : 'default'}>
              {post.liked ? (
                <ThumbUpAltIcon fontSize="small" />
              ) : (
                <ThumbUpAltOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Typography variant="caption">{post.likes} Likes</Typography>
          <Typography variant="caption">{post.comments} Comments</Typography>
          <Typography variant="caption">{post.views} Views</Typography>
        </Box>

        {/* Comments Section or Loader */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 120, mb: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CommentSection postId={post.id} comments={comments} setComments={setComments} />
        )}
      </Box>
  </Card>
    </Box>
  );
};

export default PostDetails;