import React from 'react';
import { Container, Grid, Box, Typography, IconButton, Tooltip, TextField, Button } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
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
  content: string;
  timeAgo: string;
  likes: number;
  liked?: boolean;
  createdAt?: string | null;
  replies?: NestedComment[];
}

interface NestedCommentsProps {
  comments: NestedComment[];
  onAddReply: (parentId: number, reply: string) => void;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  currentUserHandle?: string;
  replyToId: number | null;
  replyValue: string;
  setReplyValue: (v: string) => void;
  onReplyCancel: () => void;
}

const NestedComments: React.FC<NestedCommentsProps> = ({
  comments,
  onAddReply,
  onEdit,
  onDelete,
  onLike,
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
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    @{comment.userHandle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {comment.timeAgo}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="More">
                    <IconButton size="small" onClick={e => handleMenuOpen(e, comment.commentId)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                {comment.content}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Like">
                  <IconButton size="small" onClick={() => onLike && onLike(comment.commentId)} color={comment.liked ? 'primary' : 'default'}>
                    {comment.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{comment.likes}</Typography>
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={() => onAddReply(comment.commentId, '')}>
                    <ReplyOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            @{reply.userHandle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {reply.timeAgo}
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(reply.commentId)} disabled={currentUserHandle !== reply.userHandle}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => onDelete(reply.commentId)} disabled={currentUserHandle !== reply.userHandle}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                        {reply.content}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title="Like">
                          <IconButton size="small" onClick={() => onLike && onLike(reply.commentId)} color={reply.liked ? 'primary' : 'default'}>
                            {reply.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption">{reply.likes}</Typography>
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
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        {/* <MenuItem onClick={handleMenuClose}>Delete</MenuItem> */}
      </Menu>
    </Container>
  );
};

export default NestedComments;