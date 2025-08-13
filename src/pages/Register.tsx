import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    qualification: '',
    preschoolId: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: Number(formData.role),
          preschoolId: Number(formData.preschoolId),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }
      alert('User registered successfully');
      navigate('/login');
    } catch (error: any) {
      alert(error.message || 'Error registering user');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <TextField
        fullWidth margin="normal" label="First Name" name="firstName"
        value={formData.firstName} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Last Name" name="lastName"
        value={formData.lastName} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Email" name="email" type="email"
        value={formData.email} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Phone" name="phone"
        value={formData.phone} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Password" name="password" type="password"
        value={formData.password} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Confirm Password" name="confirmPassword" type="password"
        value={formData.confirmPassword} onChange={handleChange}
      />
      <TextField
        select fullWidth margin="normal" label="Role" name="role"
        value={formData.role} onChange={handleChange}
      >
        <MenuItem value={1}>Admin</MenuItem>
        <MenuItem value={2}>Teacher</MenuItem>
        <MenuItem value={3}>User</MenuItem>
      </TextField>
      <TextField
        fullWidth margin="normal" label="Qualification" name="qualification"
        value={formData.qualification} onChange={handleChange}
      />
      <TextField
        fullWidth margin="normal" label="Preschool ID" name="preschoolId" type="number"
        value={formData.preschoolId} onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Register
      </Button>
    </Container>
  );
}