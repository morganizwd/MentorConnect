import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchForums,
    createForum,
    updateForum,
    deleteForum
} from '../../redux/slices/forumSlice';
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

const AdminForums = () => {
    const dispatch = useDispatch();
    const forums = useSelector((state) => state.forums.forums);
    const status = useSelector((state) => state.forums.status);
    const error = useSelector((state) => state.forums.error);

    const [form, setForm] = useState({
        title: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchForums());
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
            dispatch(updateForum({ id: editingId, forumData: form }));
            setEditingId(null);
        } else {
            dispatch(createForum(form));
        }

        setForm({
            title: '',
            description: ''
        });
    };

    const handleEdit = (forum) => {
        setEditingId(forum.id);
        setForm({
            title: forum.title,
            description: forum.description
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteForum(id));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Forums
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editingId ? 'Update Forum' : 'Create Forum'}
                </Button>
            </Box>
            {status === 'loading' ? <p>Loading...</p> : null}
            {error ? <p>Error: {error}</p> : null}
            <List>
                {forums.map((forum) => (
                    <ListItem key={forum.id}>
                        <ListItemText
                            primary={forum.title}
                            secondary={forum.description}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(forum)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(forum.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default AdminForums;