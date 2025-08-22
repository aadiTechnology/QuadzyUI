import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, Button, LinearProgress } from '@mui/material';
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

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const pollId = poll.createdAt || poll.question + (poll.duration_type || '');
  const [showResults, setShowResults] = useState(false);
  const [votes, setVotes] = useState<number[]>(getPollVotes(pollId, poll.options.length));
  const maxSelect = poll.allow_multiple ? poll.options.length : 1;
  const [selected, setSelected] = useState<number[]>(getUserSelection(pollId));

  useEffect(() => {
    setVotes(getPollVotes(pollId, poll.options.length));
    setSelected(getUserSelection(pollId));
  }, [pollId, poll.options.length]);

  // Handle selection and vote change
  const handleSelect = (idx: number) => {
    if (poll.allow_multiple) {
      setSelected(prev =>
        prev.includes(idx)
          ? prev.filter(i => i !== idx)
          : [...prev, idx]
      );
    } else {
      setSelected([idx]);
    }
  };

  // Voting logic: only one vote per user, allow changing vote
  const handleVote = () => {
    let currentVotes = getPollVotes(pollId, poll.options.length);
    const previousSelection = getUserSelection(pollId);

    // Remove previous votes
    previousSelection.forEach((idx: number) => {
      if (currentVotes[idx] > 0) currentVotes[idx] -= 1;
    });

    // Add new votes
    selected.forEach(idx => {
      currentVotes[idx] = (currentVotes[idx] || 0) + 1;
    });

    setPollVotes(pollId, currentVotes);
    setVotes(currentVotes);
    setUserSelection(pollId, selected);
    setShowResults(true);
  };

  // Allow user to change vote
  const handleChangeVote = () => {
    setShowResults(true);
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 3,
        boxShadow: '0 2px 12px 0 rgba(60,72,120,0.06)',
        p: 2,
        mb: 2,
        mt: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 24px 0 rgba(60,72,120,0.12)' },
      }}
    >
    
      <Box display="flex" alignItems="flex-start" gap={1} flex={1} sx={{ mb: 0.5 }}>
        <PersonIcon fontSize="medium" color="action" sx={{ mt: 0.5 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
            {poll.handle || "userHandle"}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.1 }}>
              {poll.collegeName || ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ mb: 0.5, fontSize: 16, gap: 1, flex: 1, lineHeight: 1.2 }}
      >
        {poll.question}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 0.5, display: 'block', gap: 1, flex: 1, lineHeight: 1.2 }}
      >
        {poll.allow_multiple
          ? `Select up to ${maxSelect} option${maxSelect > 1 ? 's' : ''}`
          : 'Select one'}
      </Typography>

      {!showResults ? (
        <>
          {poll.options.map((opt, idx) => (
            <Box key={idx} display="flex" alignItems="center" sx={{ mb: 0.5, gap: 1, flex: 1 }}>
              <Checkbox
                checked={selected.includes(idx)}
                onChange={() => handleSelect(idx)}
                disabled={!selected.includes(idx) && selected.length >= maxSelect}
                sx={{ p: 0.5 }}
              />
              <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.2 }}>{opt}</Typography>
            </Box>
          ))}
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 0.5, fontWeight: 600, minHeight: 0, lineHeight: 1.2 }}
            onClick={handleVote}
            disabled={selected.length === 0}
          >
            View votes
          </Button>
            {/* Poll time at top */}
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {poll.createdAt ? getTimeAgo(poll.createdAt) : ''}
          {poll.duration_type ? ` • Active for ${poll.duration_type.replace('h', ' hour').replace('d', ' day').replace('w', ' week')}` : ''}
        </Typography>
      </Box>
        </>
      ) : (
        <>
          {poll.options.map((opt, idx) => (
            <Box key={idx} display="flex" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.2 }}>{opt}</Typography>
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
                  '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' }
                }}
              />
            </Box>
          ))}
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 0.5, fontWeight: 600, minHeight: 0, lineHeight: 1.2 }}
            onClick={handleChangeVote}
          >
            Back to Poll
          </Button>
          
        </>
      )}
    </Box>
  );
};

export default PollCard;