import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Checkbox, Button, LinearProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface PollCardProps {
  poll: {
    question: string;
    options: string[];
    allow_multiple: boolean;
    allow_multiple_count?: number;
    createdAt?: string;
    duration_type?: string;
    handle?: string;
    collegeName?: string;
  };
}

const getPollVotes = (pollId: string, optionsLength: number) => {
  const votes = JSON.parse(localStorage.getItem(`pollVotes_${pollId}`) || '[]');
  if (votes.length !== optionsLength) {
    return Array(optionsLength).fill(0);
  }
  return votes;
};

const setPollVotes = (pollId: string, votes: number[]) => {
  localStorage.setItem(`pollVotes_${pollId}`, JSON.stringify(votes));
};

const getUserSelection = (pollId: string) => {
  return JSON.parse(localStorage.getItem(`pollSelection_${pollId}`) || '[]');
};

const setUserSelection = (pollId: string, selected: number[]) => {
  localStorage.setItem(`pollSelection_${pollId}`, JSON.stringify(selected));
};

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const pollId = poll.createdAt || poll.question + (poll.duration_type || '');
  const [selected, setSelected] = useState<number[]>(getUserSelection(pollId));
  const [showResults, setShowResults] = useState(false);
  const [votes, setVotes] = useState<number[]>(getPollVotes(pollId, poll.options.length));
  const maxSelect = poll.allow_multiple ? (poll.allow_multiple_count || 1) : 1;

  useEffect(() => {
    setVotes(getPollVotes(pollId, poll.options.length));
    setSelected(getUserSelection(pollId));
  }, [pollId, poll.options.length]);

  const handleSelect = (idx: number) => {
    let newSelected: number[];
    if (selected.includes(idx)) {
      newSelected = selected.filter(i => i !== idx);
    } else if (selected.length < maxSelect) {
      newSelected = [...selected, idx];
    } else {
      newSelected = selected;
    }
    setSelected(newSelected);
    setUserSelection(pollId, newSelected);
  };

  // Only allow voting once per poll per user
  const handleVote = () => {
    // If user has already voted, do not increase votes again
    const alreadyVoted = getUserSelection(pollId).length > 0;
    if (!alreadyVoted && selected.length > 0) {
      let currentVotes = getPollVotes(pollId, poll.options.length);
      selected.forEach(idx => {
        currentVotes[idx] = (currentVotes[idx] || 0) + 1;
      });
      setPollVotes(pollId, currentVotes);
      setVotes(currentVotes);
      setUserSelection(pollId, selected);
    }
    setShowResults(true);
  };

const totalVotes = votes.reduce((sum, v) => sum + v, 0);

<<<<<<< Updated upstream
return (
  <Card sx={{ p: 2, mb: 2, bgcolor: '#fcfdfcff', borderRadius: 3 }}>
    {/* Header: Person icon, handle, college name */}
    <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
      <PersonIcon fontSize="small" color="action"/>
      <Typography variant="subtitle2">
        {poll.handle || 'userHandle'} ({poll.collegeName || ''})
=======
  return (
    <Card sx={{ p: 2, mb: 2, bgcolor: '#fcfdfcff', borderRadius: 3 }}>
      {/* Header: Person icon, handle, college name */}
      {/* Content Section */}
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 4 }}>
          <PersonIcon fontSize="small" color="action"/>
          <Typography variant="subtitle2">
            {poll.handle || 'userHandle'} ({poll.collegeName || ''})
          </Typography>
        </Box>

      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 1, fontSize: 18 }} // Make question bigger
      >
        {poll.question}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 1, display: 'block', fontSize: 15, fontWeight: 500 }} // Make "Select one" bigger and bolder
      >
        {poll.allow_multiple
          ? `Select up to ${maxSelect} option${maxSelect > 1 ? 's' : ''}`
          : 'Select one'}
>>>>>>> Stashed changes
      </Typography>
    </Box>

    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{ mb: 1, fontSize: 18 }} // Make question bigger
    >
      {poll.question}
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
      {poll.allow_multiple
        ? `Select up to ${maxSelect} option${maxSelect > 1 ? 's' : ''}`
        : 'Select one'}
    </Typography>

    {!showResults ? (
      <>
        {poll.options.map((opt, idx) => (
          <Box key={idx} display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Checkbox
              checked={selected.includes(idx)}
              onChange={() => handleSelect(idx)}
              disabled={!selected.includes(idx) && selected.length >= maxSelect}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>{opt}</Typography>
          </Box>
        ))}
        <Button
          variant="text"
          color="primary"
          sx={{ mt: 1, fontWeight: 600 }}
          onClick={handleVote}
          disabled={selected.length === 0}
        >
          View votes
        </Button>
      </>
    ) : (
      <>
        {poll.options.map((opt, idx) => (
          <Box key={idx} display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>{opt}</Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>{votes[idx]}</Typography>
            <LinearProgress
              variant="determinate"
              value={totalVotes ? (votes[idx] / totalVotes) * 100 : 0}
              sx={{
                width: 100,
                height: 8,
                borderRadius: 5,
                ml: 2,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } // blue bar
              }}
            />
          </Box>
        ))}
        <Button
          variant="text"
          color="primary"
          sx={{ mt: 1, fontWeight: 600 }}
          onClick={() => setShowResults(false)}
        >
          Back to poll
        </Button>
      </>
    )}

    {poll.createdAt && (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {poll.createdAt ? new Date(poll.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        {poll.duration_type ? ` • Active for ${poll.duration_type.replace('h', ' hour').replace('d', ' day').replace('w', ' week')}` : ''}
      </Typography>
    )}
  </Card>
);
};

export default PollCard;