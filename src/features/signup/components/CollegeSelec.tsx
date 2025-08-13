import React from 'react';
import { TextField, MenuItem, Avatar, Box } from '@mui/material';
import { College } from '../services/CollegeService';

interface CollegeSelectProps {
  colleges: College[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CollegeSelect: React.FC<CollegeSelectProps> = ({ colleges, value, onChange }) => (
  <TextField
    select
    label="Select your college"
    value={value}
    onChange={onChange}
    fullWidth
    margin="normal"
    variant="outlined"
    sx={{
      bgcolor: '#f5f7fa',
      borderRadius: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(0, 0, 0, 0.6)', // Consistent label color
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#1976d2', // Focused state color
      },
    }}
  >
    {colleges.map(college => (
      <MenuItem key={college.id} value={college.id}>
        <Box display="flex" alignItems="center">
          {college.logoUrl && (
            <Avatar src={college.logoUrl} sx={{ width: 24, height: 24, mr: 1 }} />
          )}
          {college.name}
        </Box>
      </MenuItem>
    ))}
  </TextField>
);

export default CollegeSelect;