import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../../redux/slices/specializationSlice';
import {
    TextField,
    Button,
    Container,
    Typography,
    Alert,
    Box,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const AdminSpecializations = () => {
    const dispatch = useDispatch();
    const { specializations, status, error } = useSelector((state) => state.specializations);
    const [form, setForm] = useState({ name: '' });
    const [editingSpecialization, setEditingSpecialization] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(fetchSpecializations());
    }, [dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingSpecialization) {
            try {
                await dispatch(updateSpecialization({ id: editingSpecialization.id, specializationData: form })).unwrap();
                setMessage('Specialization updated successfully');
                setEditingSpecialization(null);
                setForm({ name: '' });
            } catch (err) {
                setMessage('Error updating specialization: ' + err.message);
            }
        } else {
            try {
                await dispatch(createSpecialization(form)).unwrap();
                setMessage('Specialization created successfully');
                setForm({ name: '' });
            } catch (err) {
                setMessage('Error creating specialization: ' + err.message);
            }
        }
    };

    const handleEdit = (specialization) => {
        setEditingSpecialization(specialization);
        setForm({ name: specialization.name });
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteSpecialization(id)).unwrap();
            setMessage('Specialization deleted successfully');
        } catch (err) {
            setMessage('Error deleting specialization: ' + err.message);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Menu - Manage Specializations
            </Typography>
            {message && <Alert severity="info">{message}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Specialization Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={editingSpecialization ? <EditIcon /> : <AddIcon />}
                    sx={{ mt: 3, mb: 2 }}
                >
                    {editingSpecialization ? 'Update Specialization' : 'Create Specialization'}
                </Button>
            </Box>
            {status === 'loading' && <Typography>Loading...</Typography>}
            {status === 'failed' && <Typography color="error">Error: {error}</Typography>}
            <Paper sx={{ mt: 3 }}>
                <List>
                    {specializations.map((specialization) => (
                        <ListItem key={specialization.id}>
                            <ListItemText primary={specialization.name} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(specialization)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(specialization.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default AdminSpecializations;