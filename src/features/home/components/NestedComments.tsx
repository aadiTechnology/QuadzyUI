import React from 'react';
import { Container, Grid, Box, Typography, IconButton, Tooltip, TextField, Button } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export interface NestedComment {
  commentId: number;
  parentId?: number | null;
  userHandle: string;
  collegeName?: string; // <-- Add this line
  content: string;
  timeAgo: string;
  likes: number;
  liked?: boolean;
  disliked?: boolean;   // <-- add this
  dislikes?: number;    // <-- add this
  createdAt?: string | null;
  replies?: NestedComment[];
  views?: number; // <-- add this
}

interface NestedCommentsProps {
  comments: NestedComment[];
  onAddReply: (parentId: number, reply: string) => void;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  onDislike?: (commentId: number) => void;
  currentUserHandle?: string;
  replyToId: number | null;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onReplyCancel: () => void;
  onView?: (commentId: number) => void;
}

const NestedComments: React.FC<NestedCommentsProps> = ({
  comments,
  onAddReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  currentUserHandle,
  replyToId,
  replyValue,
  setReplyValue,
  onReplyCancel,
}) => {
  const topLevel = comments.filter(c => !c.parentId);
  const repliesMap: { [parentId: number]: NestedComment[] } = {};
  comments.forEach(c => {
    if (c.parentId) {
      if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
      repliesMap[c.parentId].push(c);
    }
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCommentId, setMenuCommentId] = React.useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };

  const isEditable = (comment: NestedComment) => {
    if (currentUserHandle !== comment.userHandle) return false;
    const created = new Date(comment.createdAt || 0).getTime();
    const now = Date.now();
    return now - created < 30 * 60 * 1000; // 30 mins in ms
  };

  return (
    <Container disableGutters>
      <Grid container direction="column" spacing={2}>
        {topLevel.map(comment => (
          <Grid item key={comment.commentId}>
            <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2, mb: 1 }}>
              {/* Row 1: Handle + 3 dots */}
              <Box display="flex" alignItems="center" mb={0.5}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mr: 0.5 }}>
                  @{comment.userHandle}
                </Typography>
                <Tooltip title="More">
                  <IconButton size="small" onClick={e => handleMenuOpen(e, comment.commentId)} sx={{ p: 0.5 }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Row 2: College name & time */}
              <Box mb={0.5}>
                {comment.collegeName && (
                  <Typography variant="caption" color="text.secondary">
                    {comment.collegeName} &bull; {comment.timeAgo}
                  </Typography>
                )}
                {!comment.collegeName && (
                  <Typography variant="caption" color="text.secondary">
                    {comment.timeAgo}
                  </Typography>
                )}
              </Box>
              {/* Row 3: Comment content */}
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                {comment.content}
              </Typography>
              {/* Row 4: Action icons */}
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                {/* Like */}
                <Tooltip title="Like">
                  <IconButton size="small" onClick={() => onLike && onLike(comment.commentId)} color={comment.liked ? 'primary' : 'default'}>
                    {comment.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{comment.likes}</Typography>
                {/* Dislike */}
                <Tooltip title="Dislike">
                  <IconButton size="small" onClick={() => onDislike && onDislike(comment.commentId)} color={comment.disliked ? 'error' : 'default'}>
                    {comment.disliked ? <ThumbDownAltIcon fontSize="small" /> : <ThumbDownAltOutlinedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{comment.dislikes}</Typography>
                {/* Reply */}
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={() => onAddReply(comment.commentId, '')}>
                    <ReplyOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {/* Views */}
                <Tooltip title="Views">
                  <IconButton size="small">
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{comment.views}</Typography>
              </Box>
              {/* Reply input */}
              {replyToId === comment.commentId && (
                <Box mt={1} display="flex" gap={1}>
                  <TextField
                    size="small"
                    value={replyValue}
                    onChange={e => setReplyValue(e.target.value)}
                    placeholder="Write a reply..."
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onAddReply(comment.commentId, replyValue)}
                    disabled={!replyValue.trim()}
                  >
                    Reply
                  </Button>
                  <Button variant="text" size="small" onClick={onReplyCancel}>
                    Cancel
                  </Button>
                </Box>
              )}
              {/* Replies */}
              {repliesMap[comment.commentId] && (
                <Box sx={{ mt: 2, pl: 3, borderLeft: '2px solid #e0e0e0' }}>
                  {repliesMap[comment.commentId].map(reply => (
                    <Box key={reply.commentId} sx={{ mb: 2, background: '#f0f6ff', borderRadius: 2, p: 1 }}>
                      {/* Row 1: Handle + 3 dots */}
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mr: 0.5 }}>
                          @{reply.userHandle}
                        </Typography>
                        <Tooltip title="More">
                          <IconButton size="small" onClick={e => handleMenuOpen(e, reply.commentId)} sx={{ p: 0.5 }}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {/* Row 2: College name & time */}
                      <Box mb={0.5}>
                        {reply.collegeName && (
                          <Typography variant="caption" color="text.secondary">
                            {reply.collegeName} &bull; {reply.timeAgo}
                          </Typography>
                        )}
                        {!reply.collegeName && (
                          <Typography variant="caption" color="text.secondary">
                            {reply.timeAgo}
                          </Typography>
                        )}
                      </Box>
                      {/* Row 3: Reply content */}
                      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                        {reply.content}
                      </Typography>
                      {/* Row 4: Action icons */}
                      <Box display="flex" alignItems="center" gap={1}>
                        {/* Like */}
                        <Tooltip title="Like">
                          <IconButton size="small" onClick={() => onLike && onLike(reply.commentId)} color={reply.liked ? 'primary' : 'default'}>
                            {reply.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">{reply.likes}</Typography>
                        {/* Dislike */}
                        <Tooltip title="Dislike">
                          <IconButton size="small" onClick={() => onDislike && onDislike(reply.commentId)} color={reply.disliked ? 'error' : 'default'}>
                            {reply.disliked ? <ThumbDownAltIcon fontSize="small" /> : <ThumbDownAltOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">{reply.dislikes}</Typography>
                        {/* Views */}
                        <Tooltip title="Views">
                          <IconButton size="small">
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">{reply.views}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (comments.concat(...Object.values(repliesMap)).find(c => c.commentId === menuCommentId && isEditable(c))) {
              onEdit(menuCommentId!);
            }
            handleMenuClose();
          }}
          disabled={
            !comments.concat(...Object.values(repliesMap)).find(c => c.commentId === menuCommentId && isEditable(c))
          }
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default NestedComments;