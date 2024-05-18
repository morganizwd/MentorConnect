import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
} from '../../redux/slices/contactSlice';
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

const AdminContacts = () => {
    const dispatch = useDispatch();
    const contacts = useSelector((state) => state.contacts.contacts);
    const status = useSelector((state) => state.contacts.status);
    const error = useSelector((state) => state.contacts.error);

    const [form, setForm] = useState({
        vk: '',
        telegram: '',
        phoneNumber: '',
        userId: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchContacts());
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
            dispatch(updateContact({ id: editingId, contactData: form }));
            setEditingId(null);
        } else {
            dispatch(createContact(form));
        }

        setForm({
            vk: '',
            telegram: '',
            phoneNumber: '',
            userId: ''
        });
    };

    const handleEdit = (contact) => {
        setEditingId(contact.id);
        setForm({
            vk: contact.vk,
            telegram: contact.telegram,
            phoneNumber: contact.phoneNumber,
            userId: contact.userId
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteContact(id));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Contacts
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="vk"
                    label="VK"
                    name="vk"
                    value={form.vk}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="telegram"
                    label="Telegram"
                    name="telegram"
                    value={form.telegram}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userId"
                    label="User ID"
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editingId ? 'Update Contact' : 'Create Contact'}
                </Button>
            </Box>
            {status === 'loading' ? <p>Loading...</p> : null}
            {error ? <p>Error: {error}</p> : null}
            <List>
                {contacts.map((contact) => (
                    <ListItem key={contact.id}>
                        <ListItemText
                            primary={`VK: ${contact.vk}, Telegram: ${contact.telegram}, Phone: ${contact.phoneNumber}, User ID: ${contact.userId}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(contact)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(contact.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default AdminContacts;