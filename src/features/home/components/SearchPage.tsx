// Create file: src/features/search/SearchPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 700 }}>
        Search
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Search posts, users, colleges..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Search functionality coming soon!
        </Typography>
      </Card>
    </Container>
  );
};

export default SearchPage;