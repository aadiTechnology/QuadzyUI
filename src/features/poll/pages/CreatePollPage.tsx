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
    <Container maxWidth="sm" sx={{ py: 4 }}>
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