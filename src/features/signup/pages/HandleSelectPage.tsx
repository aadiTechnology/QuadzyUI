import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, Radio, RadioGroup, FormControlLabel, Grid, Alert, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Fade from '@mui/material/Fade';
const MIN_HANDLES = 5;
const MAX_REGENERATE = 5;

const HandleSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = (location.state || {}) as { userId: number; email: string };

  const [handleHistory, setHandleHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [regenCount, setRegenCount] = useState(0);

  // Track how many times we've regenerated from each position
  const [regenFromPosition, setRegenFromPosition] = useState<number[]>([]);
  
  const handles = handleHistory[historyIndex] || [];
  
  // Calculate if we can regenerate from current position
  const currentPositionRegens = regenFromPosition[historyIndex] || 0;
  const canRegenerate = regenCount < 6;

  const fetchHandles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/auth/signup/handles');
      let handlesList = res.data.handles || [];
      if (handlesList.length < MIN_HANDLES) {
        for (let i = handlesList.length; i < MIN_HANDLES; i++) {
          handlesList.push(`@Handle${Math.floor(1000 + Math.random() * 9000)}`);
        }
      }
      setHandleHistory(prev => [...prev.slice(0, historyIndex + 1), handlesList]);
      setHistoryIndex(idx => idx + 1);
    } catch {
      setError('Failed to fetch handles. Try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch on mount
    if (handleHistory.length === 0) {
      (async () => {
        setLoading(true);
        setError('');
        try {
          const res = await api.get('/auth/signup/handles');
          let handlesList = res.data.handles || [];
          if (handlesList.length < MIN_HANDLES) {
            for (let i = handlesList.length; i < MIN_HANDLES; i++) {
              handlesList.push(`@Handle${Math.floor(1000 + Math.random() * 9000)}`);
            }
          }
          setHandleHistory([handlesList]);
          setHistoryIndex(0);
        } catch {
          setError('Failed to fetch handles. Try again.');
        }
        setLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, []);

  const handleRegenerate = async () => {
    if (canRegenerate) {
      await fetchHandles();
      setRegenCount(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(idx => idx - 1);
      // No need to modify regenCount as we track per position
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!selected) {
      setError('Please select a handle.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/users/${userId}/select-handle`, { handle: selected.replace('@', '') });
      localStorage.setItem('userHandle', selected); // Save for later use
      setLoading(false);
      navigate('/signup/terms', { state: { userId, email, handle: selected } });
    } catch {
      setLoading(false);
      setError('Failed to select handle. Try again.');
    }
  };

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: '70vh', md: '60vh' } }}>
        <Grid item xs={12}>
          <Fade in={true} timeout={700}>
          <Card sx={{ maxWidth: 400, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', borderRadius: 4, background: '#fff', boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)' }}>
            <Button sx={{ position: 'absolute', left: 30, top: 24, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#e3eafc' } }} onClick={() => navigate(-2)}>
              ←
            </Button>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Choose a handle
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is how you'll appear to other students on campus. You can change this later.
            </Typography>
            <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
              {handles.map(h => (
                <FormControlLabel key={h} value={h} control={<Radio />} label={h} sx={{ mb: 1, mx: 0 }} />
              ))}
            </RadioGroup>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                onClick={handleRegenerate}
                disabled={loading || !canRegenerate}
              >
                Regenerate Handles {!canRegenerate ? '(Limit reached)' : ''}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                onClick={handleBack}
                disabled={loading || historyIndex === 0}
              >
                Back
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 3, fontWeight: 700, py: 1.2, fontSize: '1rem', boxShadow: '0 2px 8px 0 rgba(60,72,120,0.10)' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </Button>
          </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HandleSelectPage;