import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';

interface PostFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; isPrivate: boolean; loungeId: number | null }) => void;
  loungeId: number | null;
}

const PostFormDialog: React.FC<PostFormDialogProps> = ({ open, onClose, onSubmit, loungeId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.length > 100) newErrors.title = 'Title must be at most 100 characters';
    if (!description.trim()) newErrors.description = 'Description is required';
    else if (description.length > 500) newErrors.description = 'Description must be at most 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title, description, isPrivate, loungeId });
    setTitle('');
    setDescription('');
    setIsPrivate(false);
    setErrors({});
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Post</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isPrivate"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
              />
            }
            label="Private Post"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Post</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostFormDialog;