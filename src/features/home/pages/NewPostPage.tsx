import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Chip, Container, IconButton, InputAdornment, MenuItem, OutlinedInput,
  Stack, TextField, Typography, Autocomplete, Snackbar, Alert, Tooltip
} from '@mui/material';

import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';
// import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PollIcon from '@mui/icons-material/Poll';

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createPost, fetchLounges, updatePost } from '../services/loungeService';

// Pre-defined tags
const PREDEFINED_TAGS = [
  'Science', 'Technology', 'Engineering', 'Mathematics', 'Arts', 'Literature',
  'History', 'Geography', 'Biology', 'Chemistry', 'Physics', 'Computer Science',
  'Business', 'Economics', 'Psychology', 'Philosophy', 'Music', 'Sports',
  'Health', 'Medicine', 'Law', 'Education', 'Research', 'Innovation',
  'Entrepreneurship', 'Marketing', 'Finance', 'Management', 'Design', 'Photography'
];

const NewPostPage: React.FC = () => {
  const { loungeId } = useParams<{ loungeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editingPost = location.state?.post;

  const { collegeId, collegeName, tabIndex } = location.state || {};

  console.log('NewPostPage location state:', { collegeId, collegeName, tabIndex });
  const [lounges, setLounges] = useState<any[]>([]);
  const [selectedLounge, setSelectedLounge] = useState<string>(loungeId || '');
  const [collegeNameState, setCollegeNameState] = useState(collegeName || '');
  const [title, setTitle] = useState('');
  
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(PREDEFINED_TAGS);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDraftMessage, setShowDraftMessage] = useState(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(location.state?.isPrivate ?? false);

  useEffect(() => {
    fetchLounges().then(res => setLounges(res.data));
  }, []);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setDescription(editingPost.description);
      setTags(editingPost.tags || []);
      setCollegeNameState(editingPost.institution || editingPost.collegeName || '');
      setSelectedLounge(editingPost.loungeId?.toString() || '');
      setIsPrivate(editingPost.isPrivate);
      // ...set other fields as needed
    }
  }, [editingPost]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!collegeNameState.trim()) errs.collegeName = 'College name is required';
    if (!title.trim()) errs.title = 'Heading is required';
    return errs;
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setTags(newValue);
  };
  
  const getFilteredOptions = () => {
    return availableTags.filter(tag => !tags.includes(tag));
  };

  const handleSaveDraft = async () => {
    const userHandle = localStorage.getItem('user');
    if (!JSON.parse(userHandle||"").handle) {
      setErrors({ submit: 'User handle not found. Please log in again.' });
      return;
    }

    const draftData = {
      loungeId: Number(collegeId),
      title,
      description,
      tags,
      isPrivate: isPrivate,
      media: [],
      handle: JSON.parse(userHandle||"").handle,
      collegeName: collegeNameState,
      isDraft: true // Mark as draft
    };

    try {
      // Save to localStorage as draft
      const existingDrafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
      const draftId = Date.now(); // Simple ID generation
      const newDraft = {
        id: draftId,
        ...draftData,
        createdAt: new Date().toISOString()
      };
      
      existingDrafts.push(newDraft);
      localStorage.setItem('postDrafts', JSON.stringify(existingDrafts));
      
      // Show success message
      setShowDraftMessage(true);
      
      // Clear form after saving draft
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to save draft. Try again.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const userHandle = localStorage.getItem('user');
    if (!JSON.parse(userHandle||"").handle) {
      setErrors({ submit: 'User handle not found. Please log in again.' });
      return;
    }

    const payload: any = {
      loungeId: Number(selectedLounge),
      title,
      description,
      tags,
      isPrivate: isPrivate,
      media: [],
      handle: JSON.parse(userHandle||"").handle,
      collegeName: collegeNameState,
    };

    try {
      if (editingPost && editingPost.id) {
        // EDIT MODE
        await updatePost(editingPost.id, payload);
      } else {
        // CREATE MODE
        await createPost(Number(selectedLounge), payload);
      }
      // After successful update or create
      navigate('/home', { state: { refresh: true } });
    } catch {
      setErrors({ submit: 'Failed to save post. Try again.' });
    }
  };

  return (
  <Box sx={{ position: 'relative',  minHeight: '100vh',  pb: { xs: 10, md: 10 }, }} >
       <Card sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 },  boxShadow: '0 4px 24px 0 rgba(60,72,120,0.10)', background: '#fff',position: 'sticky',
             top: 0, 
          height: '80vh', 
          overflowY: 'auto',  }} >
      <Button sx={{ position: 'absolute', left: 15, top: 15, minWidth: 36, borderRadius: 2, bgcolor: '#f5f7fa', color: '#000', fontWeight: 700, boxShadow: 0, '&:hover': { bgcolor: '#f4f5f8ff' }, }}
                    onClick={() =>  navigate('/home', { replace: true })}
                  >
                    ←
      </Button>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Add Post
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={collegeNameState}
          onChange={e => setCollegeNameState(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
          error={!!errors.collegeName}
          helperText={errors.collegeName}
        />
        <TextField
          fullWidth
          placeholder="Heading (max 500 characters)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          inputProps={{ maxLength: 500 }}
          size="small"
          sx={{ mb: 2 }}
          error={!!errors.title}
          helperText={errors.title}
        />
        
        {/* Autocomplete Tags Field */}
        <Autocomplete
          multiple
          options={getFilteredOptions()}
          value={tags}
          onChange={handleTagsChange}
          filterSelectedOptions
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={option}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={tags.length === 0 ? "Search and select tags (e.g., Science, Technology)" : "Add more tags..."}
              size="small"
              label="Tags"
              sx={{ mb: 2 }}
            />
          )}
          sx={{
            '& .MuiOutlinedInput-root': {
              minHeight: '48px',
            },
          }}
          filterOptions={(options, { inputValue }) => {
            return options.filter((option) =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            );
          }}
          noOptionsText="No matching tags found"
          clearOnBlur
          selectOnFocus
          handleHomeEndKeys
        />
        
        <TextField fullWidth multiline minRows={3} placeholder="Description" value={description}
          onChange={e => setDescription(e.target.value)} sx={{ mb: 2 }}
          error={!!errors.description}
          helperText={errors.description}
        />
        {/* Horizontal Icon-only Attachments */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'left' }}>
          <Tooltip title="Audio" placement="top">
            <IconButton size="small">
              <AudiotrackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video / Image" placement="top">
            <IconButton size="small">
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Poll" placement="top">
            <IconButton size="small"  onClick={() => navigate('/create/poll')}>
              <PollIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {errors.submit && <Typography color="error" sx={{ mb: 1 }}>{errors.submit}</Typography>}
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSaveDraft}
            sx={{ minWidth: 100 }}
          >
            Draft
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 100 }}>
            Post
          </Button>
        </Stack>
      </form>

      {/* Draft Success Message */}
      <Snackbar
        open={showDraftMessage}
        autoHideDuration={2000}
        onClose={() => setShowDraftMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Post saved as a draft
        </Alert>
      </Snackbar>
      </Card>
    </Box>
  );
};

export default NewPostPage;