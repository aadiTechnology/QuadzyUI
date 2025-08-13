import React from 'react';
import { Box, TextField } from '@mui/material';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6, disabled }) => {
  // Clear all inputs when value is reset to empty
  React.useEffect(() => {
    if (!value.trim()) {
      for (let i = 0; i < length; i++) {
        const input = document.getElementById(`otp-input-${i}`) as HTMLInputElement;
        if (input) input.value = '';
      }
    }
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const arr = value.split('');
    arr[idx] = val;
    const newVal = arr.join('').padEnd(length, '');
    onChange(newVal);
    // Focus next input
    if (val && idx < length - 1) {
      const next = document.getElementById(`otp-input-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  return (
    <Box display="flex" justifyContent="center" gap={2} mb={2}>
      {Array.from({ length }).map((_, idx) => (
        <TextField
          key={idx}
          id={`otp-input-${idx}`}
          value={value[idx] || ''}
          onChange={e => handleChange(e as React.ChangeEvent<HTMLInputElement>, idx)}
           inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              fontSize: 24, // larger font for visibility
              fontWeight: 700,
              padding: 0,
              width: '2ch', // ensures the input is wide enough for a single character
            },
          }}
          sx={{ width: 48 }}
          disabled={disabled}
        />
      ))}
    </Box>
  );
};

export default OtpInput;