import React, { useState } from 'react';
import {
  Box, Card, Typography, RadioGroup, FormControlLabel, Radio,
  TextField, Button, Snackbar, Alert, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { reportPost } from '../services/reportService';
import CancelIcon from '@mui/icons-material/Cancel';

const REASONS = [
  'Spam',
  'Harassment',
  'Hate Speech',
  'Violence',
  'Other'
];

const ReportPostPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams<{ postId: string }>();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const user = localStorage.getItem('user');
  const handle = user ? JSON.parse(user).handle : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!reason) {
      setError('Please select a reason to report this post.');
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.');
      return;
    }
    setSubmitting(true);
    try {
      await reportPost(Number(postId), { handle, reason, details });
      setSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f7fa', py: 4,lineHeight: 1.1 }}>
      <Card sx={{ maxWidth: 420, mx: 'auto', p: 3, borderRadius: 3, boxShadow: 2, position: 'relative' }}>
         <Button sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' }, }}
                               onClick={() => navigate(-1)}
                             >
                               ←
                 </Button>
        <Typography variant="h6" align="center" fontWeight={700} sx={{ mb: 2 }}>
          Report Post
        </Typography>
        <Typography sx={{ mb: 2, fontWeight: 500,lineHeight: 1.1 }}>
          Why are you reporting this post?
        </Typography>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={reason}
            onChange={e => setReason(e.target.value)}
            sx={{ mb: 2 , lineHeight: 1.1}}
          >
            {REASONS.map(r => (
              <FormControlLabel
                key={r}
                value={r}
                control={<Radio />}
                label={r}
              />
            ))}
          </RadioGroup>
          <TextField
            label="Additional details (optional)"
            multiline
            minRows={2}
            fullWidth
            value={details}
            onChange={e => setDetails(e.target.value)}
            sx={{ mb: 2, lineHeight: 1.1 }}
            InputProps={{
              endAdornment: details && (
                <IconButton
                  color="error"
                  onClick={() => setDetails('')}
                  aria-label="Cancel"
                  size="small"
                  edge="end"
                >
                  <CancelIcon />
                </IconButton>
              ),
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!reason || submitting}
          >
            Submit Report
          </Button>
        </form>
      </Card>
      <Snackbar
        open={success}
        autoHideDuration={1800}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Thank you. Your report has been submitted for review.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportPostPage;