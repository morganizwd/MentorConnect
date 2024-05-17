import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../redux/slices/userSlice';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'mentee',
    course: '',
    recordBookNumber: '',
    facultyId: '',
    specializationId: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First Name is required';
    if (!form.lastName) newErrors.lastName = 'Last Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.facultyId) newErrors.facultyId = 'Faculty ID is required';
    if (!form.specializationId) newErrors.specializationId = 'Specialization ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(fetchRegister(form)).unwrap();
      setMessage('Registration successful');
      localStorage.setItem('token', resultAction.token); // Сохранение токена в localStorage
      navigate('/'); // Redirect to login after successful registration
    } catch (err) {
      setMessage('Registration failed: ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="fname"
          autoFocus
          value={form.firstName}
          onChange={handleChange}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="lname"
          value={form.lastName}
          onChange={handleChange}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          margin="normal"
          fullWidth
          id="course"
          label="Course"
          name="course"
          autoComplete="course"
          value={form.course}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="recordBookNumber"
          label="Record Book Number"
          name="recordBookNumber"
          autoComplete="recordBookNumber"
          value={form.recordBookNumber}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="facultyId"
          label="Faculty ID"
          name="facultyId"
          autoComplete="facultyId"
          value={form.facultyId}
          onChange={handleChange}
          error={Boolean(errors.facultyId)}
          helperText={errors.facultyId}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="specializationId"
          label="Specialization ID"
          name="specializationId"
          autoComplete="specializationId"
          value={form.specializationId}
          onChange={handleChange}
          error={Boolean(errors.specializationId)}
          helperText={errors.specializationId}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Register;