import React, { useState } from 'react';
import { Box, IconButton, Typography, Menu, MenuItem, Tooltip, Chip } from '@mui/material';
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
import EditIcon from '@mui/icons-material/Edit';
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
  tags?: string[]; // <-- Add this line
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
  tabIndex,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saving, setSaving] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descRef = React.useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const handle = user ? JSON.parse(user).handle : '';

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

  const handleEdit = () => {
    navigate('/lounges/:loungeId/new-post', { state: { post } }); // or use `/edit-post/${post.id}` if you have a separate edit route
    handleMenuClose();
  };

  return (
    <Box
      sx={{ background: '#fff', borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(60,72,120,0.06)', p: 2, mb: 2, mt: 2, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 24px 0 rgba(60,72,120,0.12)', }, }} >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        {/* Left: Avatar and user info */}
        <Box display="flex" alignItems="flex-start" gap={1} flex={1}>
          <PersonIcon fontSize="medium" color="action" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {post.userHandle}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {post.institution}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {post.timeAgo}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Right: Menu */}
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
          {post.userHandle === handle && (
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
        </Menu>
      </Box>
      {/* Heading */}
      <Typography
      variant="subtitle2"
        sx={{ mb: 0.5, fontWeight: 700, cursor: 'pointer' }}
        onClick={handleNavigate}
      >
        {post.title}
      </Typography>
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {post.tags.map((tag: string) => (
            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#f3f6f9', fontWeight: 500 }} />
          ))}
        </Box>
      )}
      {/* Description */}
      <Typography
        variant="body2"
        sx={{ mb: 1, color: 'text.secondary', cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '3em', }}
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
      {/* Icons row */}
      <Box display="flex" gap={1} alignItems="center" mt={1}>
        <Tooltip title="Like">
          <IconButton
            onClick={() => onLike && onLike(post.id)}
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
            onClick={() => onDislike && onDislike(post.id)}
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
          <IconButton
            onClick={() => navigate(`/post/${post.id}`, { state: { post, openComments: true } })}
            size="small"
            color="primary"
          >
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
      </Box>
    </Box>
  );
};

export default PostCard;