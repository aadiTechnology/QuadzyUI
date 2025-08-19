import React, { useEffect } from 'react';
import { Box, Button,Typography, IconButton, Tooltip,Card, Container, CircularProgress, TextField, Menu, MenuItem } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CommentSection from './CommentDrawer'; // Import the updated CommentDrawer component
import { fetchComments, addComment, likeComment, dislikeComment, viewComment, savePost, unsavePost, updatePost } from '../services/loungeService'; // Import fetchComments and addComment services
import '../../../styles/transition.css'; // Import transition styles
import Chip from '@mui/material/Chip';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NestedComments, { NestedComment } from './NestedComments';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/BookmarkBorder';
import FlagIcon from '@mui/icons-material/FlagOutlined';
import EditIcon from '@mui/icons-material/Edit';

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

  const [comments, setComments] = React.useState<NestedComment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showComments, setShowComments] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [replyToId, setReplyToId] = React.useState<number | null>(null);
  const [replyValue, setReplyValue] = React.useState('');
  const [postMenuAnchor, setPostMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [saved, setSaved] = React.useState<boolean>(post.saved || false); // Add this state
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(post.title);
  const [editDescription, setEditDescription] = React.useState(post.description);

  // Get current user handle from localStorage
  const user = localStorage.getItem('user');
  const currentUserHandle = user ? JSON.parse(user).handle : '';

  // Fetch comments only when showComments is true
  useEffect(() => {
    if (post && showComments) {
      setLoading(true);
      fetchComments(post.id)
        .then(res => setComments(res.data)) // <-- flat array
        .finally(() => setLoading(false));
    }
  }, [post, showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(post.id, newComment, currentUserHandle);
    setNewComment('');
    const res = await fetchComments(post.id);
    setComments(res.data); // <-- flat array
  };

  // When user clicks "Reply" icon
  const handleReplyIconClick = (parentId: number) => {
    setReplyToId(parentId);
    setReplyValue('');
  };

  // When user submits a reply
  const handleAddReply = async (parentId: number, reply?: string) => {
    const replyText = reply !== undefined ? reply : replyValue;
    if (!replyText.trim()) {
      setReplyToId(parentId); // open input
      return;
    }
    await addComment(post.id, replyText, currentUserHandle, parentId);
    setReplyValue('');
    setReplyToId(null);
    const res = await fetchComments(post.id);
    setComments(res.data); // <-- flat array
  };

  const handleReplyCancel = () => {
    setReplyToId(null);
    setReplyValue('');
  };

  const handlePostMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPostMenuAnchor(event.currentTarget);
  };
  const handlePostMenuClose = () => {
    setPostMenuAnchor(null);
  };

  const handleSaveToggle = async () => {
    if (!currentUserHandle) return;
    if (saved) {
      await unsavePost(post.id, currentUserHandle);
      setSaved(false);
    } else {
      await savePost(post.id, currentUserHandle);
      setSaved(true);
    }
  };

  const handleEditPost = async () => {
    await updatePost(post.id, { title: editTitle, description: editDescription });
    setEditing(false);
    // Optionally, refresh post data here
  };

  if (!post) {
    return <Typography variant="h6">Post not found</Typography>;
  }

  // Handler stubs (replace with your real logic)
  const handleEdit = (commentId: number) => { /* open edit input, etc. */ };
  const handleDelete = (commentId: number) => { /* delete logic */ };
  const handleLike = async (commentId: number) => {
    await likeComment(commentId);
    const res = await fetchComments(post.id);
    setComments(res.data);
  };

  const handleDislike = async (commentId: number) => {
    await dislikeComment(commentId);
    const res = await fetchComments(post.id);
    setComments(res.data);
  };

  const handleView = async (commentId: number) => {
    await viewComment(commentId);
    const res = await fetchComments(post.id);
    setComments(res.data);
  };

  // Prefer userHandle, fallback to handle
  const handle = post.userHandle || post.handle || '';
  const college = post.institution || post.collegeName || '';
  const timeAgo = post.timeAgo || '';

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: { xs: 10, md: 10 } }}>
      <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 }, boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff', position: 'sticky', top: 0, height: '80vh', overflowY: 'auto' }}>
        <Button sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' } }}
          onClick={() => navigate(-1)}
        >
          ←
        </Button>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          View Post
        </Typography>
        <Box className="screen-transition-enter" sx={{ position: 'relative', overflow: 'hidden' }}>
          {/* Content Section */}
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Box display="flex" alignItems="flex-start" gap={1} >
                <PersonIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  @{handle}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {college}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {timeAgo}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="More">
                <IconButton size="small" onClick={handlePostMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={postMenuAnchor}
                open={Boolean(postMenuAnchor)}
                onClose={handlePostMenuClose}
              >
                <MenuItem onClick={() => { handleSaveToggle(); handlePostMenuClose(); }}>
                  <SaveIcon fontSize="small" sx={{ mr: 1 }} />
                  {saved ? 'Unsave' : 'Save'}
                </MenuItem>
                <MenuItem onClick={() => { /* Flag logic here */ handlePostMenuClose(); }}>
                  <FlagIcon fontSize="small" sx={{ mr: 1 }} /> Flag
                </MenuItem>
                {currentUserHandle === post.userHandle && (
                  <MenuItem
                    onClick={() => {
                      handlePostMenuClose();
                      navigate(`/lounges/${post.institutionId || post.loungeId || ''}/new-post`, {
                        state: { post }
                      });
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                  </MenuItem>
                )}
              </Menu>
            </Box>
            
          {editing ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                label="Title"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                label="Description"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleEditPost} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="text" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Typography  variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                {post.title}
              </Typography>
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {post.tags.map((tag: string) => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#f3f6f9', fontWeight: 500 }} />
                  ))}
                </Box>
              )}
              <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary', display: '-webkit-box', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '3em', }}>
                {post.description}
              </Typography>
              <Box display="flex" gap={2} alignItems="center" sx={{ mb: 1 }}>
                <Tooltip title="Like">
                  <IconButton size="small" color={post.liked ? 'primary' : 'default'}>
                    {post.liked ? (
                      <ThumbUpAltIcon fontSize="small" />
                    ) : (
                      <ThumbUpAltOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{post.likes}</Typography>
                <Tooltip title="Dislike">
                  <IconButton size="small" color={post.disliked ? 'error' : 'default'}>
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
                    size="small"
                    color="primary"
                    onClick={() => setShowComments((prev) => !prev)}
                  >
                    <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{post.comments}</Typography>
                <Tooltip title="Views">
                  <IconButton size="small" color="primary">
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{post.views}</Typography>
              </Box>
              {/* Comments Section or Loader */}
              {showComments && (
                loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 120, mb: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Box display="flex" gap={1} mb={2} alignItems="flex-end">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <Tooltip title="Send">
                        <IconButton onClick={handleAddComment} color="primary">
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <NestedComments
                      comments={comments}
                      onAddReply={handleAddReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onLike={handleLike}
                      onDislike={handleDislike}
                      onView={handleView}
                      currentUserHandle={currentUserHandle}
                      replyToId={replyToId}
                      replyValue={replyValue}
                      setReplyValue={setReplyValue}
                      onReplyCancel={handleReplyCancel}
                    />
                  </>
                )
              )}
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PostDetails;