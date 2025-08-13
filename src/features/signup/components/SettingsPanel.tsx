import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Card,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Container,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import StarIcon from '@mui/icons-material/Star';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const themeThumbnails = [
  { name: 'Blue', color: '#1976d2' },
  { name: 'Green', color: '#43a047' },
  { name: 'Purple', color: '#8e24aa' },
  { name: 'Dark', color: '#212121' },
];

const inboxTypes = [
  { label: 'Default', icon: <InboxIcon /> },
  { label: 'Important First', icon: <LabelImportantIcon /> },
  { label: 'Starred First', icon: <StarIcon /> },
];

const densityOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Compact', value: 'compact' },
];

const initialTeam = [
  { name: 'Alice', role: 'Admin' },
  { name: 'Bob', role: 'Member' },
];

const roles = ['Admin', 'Member', 'Viewer'];

const SettingsPanel: React.FC = () => {
  // Density
  const [density, setDensity] = useState('default');
  // Theme
  const [theme, setTheme] = useState('Blue');
  // Inbox
  const [inboxType, setInboxType] = useState('Default');
  // Team
  const [team, setTeam] = useState(initialTeam);
  const [addDialog, setAddDialog] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Member' });

  // Handlers
  const handleAddMember = () => {
    setTeam([...team, newMember]);
    setAddDialog(false);
    setNewMember({ name: '', role: 'Member' });
  };

  const handleRemoveMember = (idx: number) => {
    setTeam(team.filter((_, i) => i !== idx));
  };

  const handleRoleChange = (idx: number, role: string) => {
    setTeam(team.map((member, i) => (i === idx ? { ...member, role } : member)));
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Settings
          </Typography>
        </Grid>

        {/* Density Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Density
            </Typography>
            <RadioGroup
              row
              value={density}
              onChange={e => setDensity(e.target.value)}
              sx={{ gap: 4 }}
            >
              {densityOptions.map(opt => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography>{opt.label}</Typography>
                      <Box
                        sx={{
                          mt: 1,
                          width: 80,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: '#f5f5f5',
                          boxShadow: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: opt.value === 'compact' ? 12 : opt.value === 'comfortable' ? 18 : 16,
                        }}
                      >
                        {opt.label === 'Compact' ? 'Aa' : opt.label === 'Comfortable' ? 'Aa' : 'Aa'}
                      </Box>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </Card>
        </Grid>

        {/* Theme Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Theme
            </Typography>
            <Grid container spacing={2}>
              {themeThumbnails.map(t => (
                <Grid item xs={6} key={t.name}>
                  <Card
                    onClick={() => setTheme(t.name)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: theme === t.name ? 4 : 1,
                      border: theme === t.name ? '2px solid #1976d2' : '1px solid #eee',
                      cursor: 'pointer',
                      textAlign: 'center',
                      bgcolor: t.color,
                      color: '#fff',
                    }}
                  >
                    <Typography fontWeight={600}>{t.name}</Typography>
                    <Box sx={{ mt: 1, height: 40, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }} />
                    {theme === t.name && (
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        Selected
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Inbox Type Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={600}>
                Inbox Type
              </Typography>
              <Button variant="outlined" size="small">
                Customize
              </Button>
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {inboxTypes.map(type => (
                <Grid item xs={12} sm={4} key={type.label}>
                  <Card
                    onClick={() => setInboxType(type.label)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: inboxType === type.label ? 4 : 1,
                      border: inboxType === type.label ? '2px solid #1976d2' : '1px solid #eee',
                      cursor: 'pointer',
                      textAlign: 'center',
                      bgcolor: '#fafafa',
                    }}
                  >
                    <Box sx={{ mb: 1 }}>{type.icon}</Box>
                    <Typography fontWeight={600}>{type.label}</Typography>
                    {inboxType === type.label && (
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        Selected
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Team Management Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Team Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2, boxShadow: 0 }}
                onClick={() => setAddDialog(true)}
              >
                Add Member
              </Button>
            </Box>
            <Grid container spacing={2}>
              {team.map((member, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{member.name.charAt(0)}</Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={600}>{member.name}</Typography>
                      <Select
                        size="small"
                        value={member.role}
                        onChange={e => handleRoleChange(idx, e.target.value)}
                        sx={{ mt: 1, minWidth: 100 }}
                      >
                        {roles.map(role => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <IconButton onClick={() => handleRemoveMember(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)}>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newMember.name}
            onChange={e => setNewMember({ ...newMember, name: e.target.value })}
          />
          <Select
            fullWidth
            value={newMember.role}
            onChange={e => setNewMember({ ...newMember, role: e.target.value })}
            sx={{ mt: 1 }}
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={!newMember.name}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SettingsPanel;
