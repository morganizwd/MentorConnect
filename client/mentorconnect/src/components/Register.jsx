import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister } from '../redux/slices/userSlice';
import { fetchFaculties } from '../redux/slices/facultySlice';
import { fetchSpecializations } from '../redux/slices/specializationSlice';
import { TextField, Button, Container, Typography, Alert, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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

    const faculties = useSelector((state) => state.faculties.faculties);
    const specializations = useSelector((state) => state.specializations.specializations);

    useEffect(() => {
        dispatch(fetchFaculties());
        dispatch(fetchSpecializations());
    }, [dispatch]);

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
                <FormControl fullWidth margin="normal" required error={Boolean(errors.facultyId)}>
                    <InputLabel id="facultyId-label">Faculty</InputLabel>
                    <Select
                        labelId="facultyId-label"
                        id="facultyId"
                        name="facultyId"
                        value={form.facultyId}
                        onChange={handleChange}
                    >
                        {faculties.map((faculty) => (
                            <MenuItem key={faculty.id} value={faculty.id}>
                                {faculty.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.facultyId && <Typography color="error">{errors.facultyId}</Typography>}
                </FormControl>
                <FormControl fullWidth margin="normal" required error={Boolean(errors.specializationId)}>
                    <InputLabel id="specializationId-label">Specialization</InputLabel>
                    <Select
                        labelId="specializationId-label"
                        id="specializationId"
                        name="specializationId"
                        value={form.specializationId}
                        onChange={handleChange}
                    >
                        {specializations.map((specialization) => (
                            <MenuItem key={specialization.id} value={specialization.id}>
                                {specialization.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.specializationId && <Typography color="error">{errors.specializationId}</Typography>}
                </FormControl>
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