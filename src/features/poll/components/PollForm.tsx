import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Switch,
  Radio, RadioGroup, FormControlLabel, Grid, Alert, Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField as MuiTextField } from '@mui/material';

interface PollFormProps {
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
  error: string;
}

const DURATION_OPTIONS = [
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: 'custom', label: 'Custom' },
];

export default function PollForm({ onSubmit, submitting, error }: PollFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [allowMultipleCount, setAllowMultipleCount] = useState(1);
  const [durationType, setDurationType] = useState('1d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!question.trim()) errs.question = 'Question is required';
    const filledOptions = options.filter(opt => opt.trim());
    if (filledOptions.length < 2) errs.options = 'At least 2 options required';
    if (filledOptions.length > 5) errs.options = 'Maximum 5 options allowed';
    if (durationType === 'custom') {
      if (!customStart) errs.customStart = 'Start time required';
      if (!customEnd) errs.customEnd = 'End time required';
      if (customStart && customEnd && new Date(customStart) >= new Date(customEnd)) {
        errs.customEnd = 'End must be after start';
      }
    }
    return errs;
  };

  const handleOptionChange = (idx: number, value: string) => {
    setOptions(opts => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const handleAddOption = (e: React.MouseEvent) => {
    e.preventDefault();
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== idx));
  };

  const handleAllowMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowMultiple(e.target.checked);
    if (!e.target.checked) setAllowMultipleCount(1);
  };

  const handleAllowMultipleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > options.filter(opt => opt.trim()).length) val = options.filter(opt => opt.trim()).length;
    if (val > 5) val = 5;
    setAllowMultipleCount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload: any = {
      postId: 2, // Replace with dynamic postId if needed
      question: question.trim(),
      options: options.filter(opt => opt.trim()),
      allow_multiple: allowMultiple,
      allow_multiple_count: allowMultiple ? allowMultipleCount : 1,
      duration_type: durationType,
    };
    if (durationType === 'custom') {
      payload.custom_start = customStart;
      payload.custom_end = customEnd;
    }
    await onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: 0, py: 0 }}>
    
      <TextField
        label="Ask a question"
        fullWidth
        value={question}
        onChange={e => setQuestion(e.target.value)}
        error={!!errors.question}
        helperText={errors.question}
        sx={{ mb: 2 }}
        variant="outlined"
        size="small"
      />
      <Typography fontWeight={500} sx={{ mb: 1, fontSize: 15 }}>Options</Typography>
      {options.map((opt, idx) => (
        <Box key={idx} display="flex" alignItems="center" mb={1}>
          <TextField
            value={opt}
            onChange={e => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            fullWidth
            error={!!errors.options && !opt.trim()}
            variant="outlined"
            size="small"
            sx={{ bgcolor: '#fafafa' }}
          />
          {options.length > 2 && (
            <IconButton
              onClick={() => handleRemoveOption(idx)}
              sx={{ ml: 1, color: '#f85959ff' }}
              aria-label="Delete option"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
      <Box display="flex" alignItems="center" mb={2}>
        <Link
          href="#"
          underline="none"
          color="primary"
          fontWeight={700}
          sx={{ fontSize: 15, mr: 2 }}
          onClick={handleAddOption}
          data-testid="add-option-link"
        >
          <AddIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
          ADD OPTION
        </Link>
      </Box>
      {errors.options && (
        <Typography color="error" sx={{ mb: 1 }}>{errors.options}</Typography>
      )}

      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <Typography fontWeight={500} sx={{ mr: 2, fontSize: 17, fontWeight: 'bold' }}>Poll Duration</Typography>
        <RadioGroup
          row
          value={durationType}
          onChange={e => setDurationType(e.target.value)}
        >
          {DURATION_OPTIONS.map(opt => (
            <FormControlLabel
              key={opt.value}
              value={opt.value}
              control={<Radio />}
              label={opt.label}
              sx={{ mr: 2 }}
            />
          ))}
        </RadioGroup>
      </Box>
      {durationType === 'custom' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Start"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              error={!!errors.customStart}
              helperText={errors.customStart}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              error={!!errors.customEnd}
              helperText={errors.customEnd}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={allowMultiple}
            onChange={handleAllowMultipleChange}
            color="primary"
          />
        }
        label="Allow Multiple Answers"
        sx={{ mb: 2, fontWeight: 500 }}
      />
      {/* {allowMultiple && (
        <MuiTextField
          label="How many options can be selected?"
          type="number"
          size="small"
          value={allowMultipleCount}
          onChange={handleAllowMultipleCountChange}
          inputProps={{ min: 1, max: options.filter(opt => opt.trim()).length || 5 }}
          sx={{ mb: 2, width: 220 }}
        />
      )} */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={submitting || !!Object.keys(validate()).length}
        sx={{
          py: 1.2,
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 2,
          bgcolor: '#1976d2',
          color: '#fff',
          boxShadow: 'none',
          opacity: submitting || !!Object.keys(validate()).length ? 0.5 : 1
        }}
      >
        CREATE POLL
      </Button>
    </Box>
  );
}
