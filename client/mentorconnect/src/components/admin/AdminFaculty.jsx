import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty
} from '../../redux/slices/facultySlice';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const AdminFaculties = () => {
    const dispatch = useDispatch();
    const faculties = useSelector((state) => state.faculties.faculties);
    const status = useSelector((state) => state.faculties.status);
    const error = useSelector((state) => state.faculties.error);

    const [form, setForm] = useState({
        name: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchFaculties());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            dispatch(updateFaculty({ id: editingId, facultyData: form }));
            setEditingId(null);
        } else {
            dispatch(createFaculty(form));
        }

        setForm({
            name: ''
        });
    };

    const handleEdit = (faculty) => {
        setEditingId(faculty.id);
        setForm({
            name: faculty.name
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteFaculty(id));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Faculties
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Faculty Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editingId ? 'Update Faculty' : 'Create Faculty'}
                </Button>
            </Box>
            {status === 'loading' ? <p>Loading...</p> : null}
            {error ? <p>Error: {error}</p> : null}
            <List>
                {faculties.map((faculty) => (
                    <ListItem key={faculty.id}>
                        <ListItemText
                            primary={faculty.name}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(faculty)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(faculty.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default AdminFaculties;