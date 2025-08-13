import React, { useState } from 'react';
import { Box, IconButton, Typography, Menu, MenuItem, Tooltip } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { dislikePost, savePost, unsavePost, viewPost } from '../services/loungeService';
import '../../../styles/transition.css'; // Correct path to transition styles
//src\features\home\components\PostCard.tsx
export interface Post {
  id: number;
  userHandle: string;
  institution: string;
  timeAgo: string;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  isPrivate: boolean;
  liked: boolean;
  disliked?: boolean;
  saved?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onDislike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onView?: (postId: number) => void;
  onSaveToggle?: (postId: number, saved: boolean) => void;
  tabIndex?: number; // <-- Add this line
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDislike,
  onComment,
  onView,
  onSaveToggle,
  tabIndex, // <-- Add this line
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saving, setSaving] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descRef = React.useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (descRef.current) {
      // Check if the content overflows (is truncated)
      setShowReadMore(descRef.current.scrollHeight > descRef.current.clientHeight + 2);
    }
  }, [post.description]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSaveToggle = async () => {
    setSaving(true);
    const user = localStorage.getItem('user');
    const handle = user ? JSON.parse(user).handle : '';
    if (!handle) return;
    if (post.saved) {
      await unsavePost(post.id, handle);
      onSaveToggle?.(post.id, false);
    } else {
      await savePost(post.id, handle);
      onSaveToggle?.(post.id, true);
    }
    setSaving(false);
    handleMenuClose();
  };

  const handleNavigate = async () => {
    // Call viewPost API before navigating
    await viewPost(post.id);
    if (onView) onView(post.id); // Optionally update state in parent
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <Box
      sx={{
        borderBottom: '1px solid #e3e3e3',
        mt: 2,
        mb: 2,
        '&:last-child': { borderBottom: 'none', mb: 0 },
        cursor: 'default', // Default cursor for the entire row
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="subtitle2">
            {post.userHandle} ({post.institution})
          </Typography>
        </Box>
        <Typography variant="caption">{post.timeAgo}</Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{ mb: 0.5, fontWeight: 700, cursor: 'pointer' }} // Add pointer cursor for clickable title
        onClick={handleNavigate} // Trigger navigation with animation
      >
        {post.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          color: 'text.secondary',
          cursor: 'pointer',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '3em', // Ensures consistent height for 2 lines
        }}
        ref={descRef}
        onClick={handleNavigate}
      >
        {post.description}
      </Typography>
      {showReadMore && (
        <Box sx={{ mt: -1.5, mb: 1 }}>
          <span style={{ color: '#888' }}>... </span>
          <span
            style={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
             more
          </span>
        </Box>
      )}
      <Box display="flex" gap={1} alignItems="center">
        <Tooltip title="Like">
          <IconButton
            onClick={() => onLike && onLike(post.id)} // Handle like action
            size="small"
            color={post.liked ? 'primary' : 'default'}
          >
            {post.liked ? (
              <ThumbUpAltIcon fontSize="small" />
            ) : (
              <ThumbUpAltOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Typography variant="caption">{post.likes}</Typography>
        <Tooltip title="Dislike">
          <IconButton
            onClick={() => onDislike && onDislike(post.id)} // Handle dislike action
            size="small"
            color={post.disliked ? 'error' : 'default'}
          >
            {post.disliked ? (
              <ThumbDownAltIcon fontSize="small" />
            ) : (
              <ThumbDownAltOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Typography variant="caption">{post.dislikes}</Typography>
        <Tooltip title="Comment">
          <IconButton onClick={() => onComment && onComment(post.id)} size="small" color="primary">
            <ChatBubbleOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="caption">{post.comments}</Typography>
        <Tooltip title="Views">
          <IconButton onClick={() => onView && onView(post.id)} size="small" color="primary">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="caption">{post.views}</Typography>
        {post.isPrivate && tabIndex !== 0 && (
          <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
            Private
          </Typography>
        )}
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleSaveToggle} disabled={saving}>
            {post.saved ? (
              <>
                <BookmarkIcon fontSize="small" sx={{ mr: 1 }} /> Unsave
              </>
            ) : (
              <>
                <BookmarkBorderIcon fontSize="small" sx={{ mr: 1 }} /> Save
              </>
            )}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default PostCard;