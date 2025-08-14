import React, { useState } from 'react';
import { Container, Button,Card, Snackbar, Alert, Box } from '@mui/material';
// Update the import path below if PollForm is located elsewhere
import PollForm from '../components/PollForm'; // Change this path if PollForm is not in the parent directory
import { createPoll } from '../services/pollService';
import { useNavigate } from 'react-router-dom';

const CreatePollPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    setError('');
    try {
      // Get user handle and college name from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const handle = user.handle || '';
      const collegeName = user.collegeName || localStorage.getItem('collegeName') || 'Your College';

      const pollData = {
        ...data,
        handle,
        collegeName,
        createdAt: new Date().toISOString(),
      };
      await createPoll(pollData);
      // Save poll to localStorage
      const savedPolls = JSON.parse(localStorage.getItem('createdPolls') || '[]');
      savedPolls.push({ ...pollData, createdAt: new Date().toISOString() });
      localStorage.setItem('createdPolls', JSON.stringify(savedPolls));
      setSuccess(true);
      setTimeout(() => navigate('/home'), 1500);
    } catch {
      setError('Failed to create poll. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
    <PollForm onSubmit={handleSubmit} submitting={submitting} error={error} />
    <Snackbar open={success} autoHideDuration={1500}>
      <Alert severity="success" sx={{ width: '100%' }}>
        Poll created successfully!
      </Alert>
    </Snackbar>
     </Card>
  </Box>
);
};

export default CreatePollPage;