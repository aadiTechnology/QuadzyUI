import React, { useState } from 'react';
import { Container, Snackbar, Alert } from '@mui/material';
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
      await createPoll(data);
      // Save poll to localStorage
      const savedPolls = JSON.parse(localStorage.getItem('createdPolls') || '[]');
      savedPolls.push({ ...data, createdAt: new Date().toISOString() });
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
<<<<<<< Updated upstream
    <Container maxWidth="sm" sx={{ py: 4 }}>
=======
    <Container maxWidth="xs" sx={{ py: 2 }}>
        <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 },  boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff',position: 'sticky',
             top: 0, 
          height: '80vh', 
          overflowY: 'auto',  }} >
      <Box>
        <Button
          sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' }, }}
          onClick={() => navigate(`/lounges/${loungeId}/new-post`, { replace: true })}
        >
          ←
        </Button>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Create Poll
        </Typography>
        {/* Empty box for spacing to center the title */}
        <Box sx={{ width: 40 }} />
      </Box>
>>>>>>> Stashed changes
      <PollForm onSubmit={handleSubmit} submitting={submitting} error={error} />
      <Snackbar open={success} autoHideDuration={1500}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Poll created successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePollPage;