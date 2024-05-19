import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, updateUser } from '../redux/slices/userSlice';
import { fetchTagsByUserId, createTag, deleteTag } from '../redux/slices/tagSlice';
import { fetchContactsByUserId, createContact, deleteContact } from '../redux/slices/contactSlice';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.data);
    const tags = useSelector((state) => state.tags.tags);
    const contacts = useSelector((state) => state.contacts.contacts);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        course: '',
        recordBookNumber: '',
        facultyId: '',
        specializationId: '',
        avatar: null,
        role: '',
    });
    const [newTag, setNewTag] = useState('');
    const [newContact, setNewContact] = useState({
        vk: '',
        telegram: '',
        phoneNumber: '',
    });

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: '',
                course: user.course || '',
                recordBookNumber: user.recordBookNumber || '',
                facultyId: user.facultyId,
                specializationId: user.specializationId,
                avatar: null,
                role: user.role || '',
            });
            dispatch(fetchTagsByUserId(user.id));
            dispatch(fetchContactsByUserId(user.id));
        }
    }, [user, dispatch]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setNewContact({
            ...newContact,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        dispatch(updateUser({ id: user.id, formData }));
    };

    const handleAddTag = () => {
        if (newTag.trim()) {
            dispatch(createTag({ name: newTag }));
            setNewTag('');
        }
    };

    const handleDeleteTag = (id) => {
        dispatch(deleteTag(id));
    };

    const handleAddContact = () => {
        if (newContact.vk || newContact.telegram || newContact.phoneNumber) {
            dispatch(createContact({ ...newContact, userId: user.id }));
            setNewContact({
                vk: '',
                telegram: '',
                phoneNumber: '',
            });
        }
    };

    const handleDeleteContact = (id) => {
        dispatch(deleteContact(id));
    };

    const apiUrl = 'http://localhost:7000';

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const userTags = tags.filter(tag => tag.userId === user.id);
    const userContacts = contacts.filter(contact => contact.userId === user.id);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={user.avatar ? `${apiUrl}${user.avatar}` : ''}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 100, height: 100, mr: 2 }}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar"
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                    />
                    <label htmlFor="avatar">
                        <IconButton component="span">
                            <EditIcon />
                        </IconButton>
                    </label>
                </Box>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    autoFocus
                    value={form.firstName}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    value={form.password}
                    onChange={handleChange}
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
                    fullWidth
                    id="role"
                    label="Role"
                    name="role"
                    value={form.role}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Update Profile
                </Button>
            </Box>
            <Typography variant="h5" gutterBottom>
                Tags
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TextField
                    label="New Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleAddTag}>
                    Add Tag
                </Button>
            </Box>
            <List>
                {userTags.map((tag) => (
                    <ListItem key={tag.id}>
                        <ListItemText primary={tag.name} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(tag.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Typography variant="h5" gutterBottom>
                Contacts
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TextField
                    label="VK"
                    name="vk"
                    value={newContact.vk}
                    onChange={handleContactChange}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="Telegram"
                    name="telegram"
                    value={newContact.telegram}
                    onChange={handleContactChange}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={newContact.phoneNumber}
                    onChange={handleContactChange}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleAddContact}>
                    Add Contact
                </Button>
            </Box>
            <List>
                {userContacts.map((contact) => (
                    <ListItem key={contact.id}>
                        <ListItemText
                            primary={`${contact.vk ? `VK: ${contact.vk}` : ''} ${contact.telegram ? `Telegram: ${contact.telegram}` : ''} ${contact.phoneNumber ? `Phone: ${contact.phoneNumber}` : ''}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteContact(contact.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default UserProfile;
