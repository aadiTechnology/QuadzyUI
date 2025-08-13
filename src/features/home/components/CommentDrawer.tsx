import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Tooltip, Input } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { addComment } from '../services/loungeService';
import api from '../../../services/api'; // Add this import

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

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, setComments }) => {
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTimer, setEditTimer] = useState<NodeJS.Timeout | null>(null);

  // Dummy like handler
  const handleLike = (commentId: number) => {
    setComments(prev =>
      prev.map(c =>
        c.commentId === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  // Dummy reply handler
  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
  };

  // Dummy attachment handler
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  // Dummy submit handler for comment/reply
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    const user = localStorage.getItem('user');
    const handle = user ? JSON.parse(user).handle : '';
    try {
      const res = await addComment(postId, comment, handle, replyTo);
      if (replyTo) {
        setComments(prev =>
          prev.map(c =>
            c.commentId === replyTo
              ? { ...c, replies: [...(c.replies || []), { ...res.data, replies: [] }] }
              : c
          )
        );
      } else {
        setComments(prev => [
          { ...res.data, replies: [], attachments: [], liked: false },
          ...prev,
        ]);
      }
      setComment('');
      setReplyTo(null);
      setAttachment(null);
    } catch (e) {
      // Optionally show error
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.commentId);
    setEditContent(comment.content);
    // Optional: auto-focus logic
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
    if (editTimer) clearTimeout(editTimer);
  };

  const handleEditSave = async (comment: Comment) => {
    const user = localStorage.getItem('user');
    const handle = user ? JSON.parse(user).handle : '';
    try {
      // Call your backend API
      await api.put(`/auth/comments/${comment.commentId}`, { content: editContent, handle });
      setComments(prev =>
        prev.map(c =>
          c.commentId === comment.commentId
            ? { ...c, content: editContent }
            : c
        )
      );
      setEditingId(null);
      setEditContent('');
    } catch (e) {
      // Optionally show error
    }
  };

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

  const nestedComments = nestComments(comments);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>
      <Box display="flex" gap={1} mb={2} alignItems="flex-end">
        <TextField fullWidth size="small" multiline minRows={1}  maxRows={6} autoFocus
          placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ '& .MuiInputBase-root': { transition: 'min-height 0.2s', resize: 'none', },  }}
          inputProps={{  style: { resize: 'none' } }} />
        <Tooltip title="Attach file">
          <IconButton component="label" sx={{ alignSelf: 'flex-end' }}>
            <AttachFileIcon />
            <Input type="file" sx={{ display: 'none' }} onChange={handleAttachment} />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          onClick={handleAddComment}
          sx={{ height: 40, minWidth: 80,  alignSelf: 'flex-end', fontWeight: 700,  fontSize: 16, letterSpacing: 1, }} >
          {replyTo ? "Reply" : "Send"}
        </Button>
      </Box>
      <List>
        {nestedComments.map((c) => (
          <Box key={c.commentId} sx={{ mb: 2 }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  editingId === c.commentId ? (
                    <Box>
                      <TextField
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)} multiline minRows={1} maxRows={6} fullWidth size="small" sx={{ mb: 1 }} />
                      <Button variant="contained" size="small"
                        onClick={() => handleEditSave(c)}  sx={{ mr: 1 }} >
                        Save
                      </Button>
                      <Button variant="outlined" size="small"
                        onClick={handleEditCancel} >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <span>
                      <strong>@{c.userHandle}</strong>: {c.content}
                    </span>
                  )
                }
                secondary={
                  <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Like">
                      <IconButton size="small" onClick={() => handleLike(c.commentId)} color={c.liked ? 'primary' : 'default'}>
                        {c.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption">{c.likes}</Typography>
                    <Tooltip title="Reply">
                      <IconButton size="small" onClick={() => handleReply(c.commentId)}>
                        <ReplyOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {c.attachments && c.attachments.map((file, idx) => (
                      <a key={idx} href={file} target="_blank" rel="noopener noreferrer">
                        <AttachFileIcon fontSize="small" />
                      </a>
                    ))}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {c.timeAgo}
                    </Typography>
                    {c.userHandle === (JSON.parse(localStorage.getItem('user') || '{}').handle) && (
                      <Button
                        size="small"
                        onClick={() => handleEdit(c)}
                        sx={{ textTransform: 'none', fontSize: 12, ml: 1 }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {/* Replies */}
            {c.replies && c.replies.length > 0 && (
              <Box sx={{ pl: 4, borderLeft: '2px solid #e0e0e0', ml: 2 }}>
                {c.replies.map((r) => (
                  <ListItem key={r.commentId} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <span>
                          <strong>@{r.userHandle}</strong>: {r.content}
                        </span>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Tooltip title="Like">
                            <IconButton size="small" onClick={() => handleLike(r.commentId)} color={r.liked ? 'primary' : 'default'}>
                              {r.liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Typography variant="caption">{r.likes}</Typography>
                          {r.attachments && r.attachments.map((file, idx) => (
                            <a key={idx} href={file} target="_blank" rel="noopener noreferrer">
                              <AttachFileIcon fontSize="small" />
                            </a>
                          ))}
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {r.timeAgo}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default CommentSection;