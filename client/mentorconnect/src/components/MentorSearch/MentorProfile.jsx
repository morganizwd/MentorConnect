import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../../redux/slices/userSlice';
import { fetchFaculties } from '../../redux/slices/facultySlice';
import { fetchSpecializations } from '../../redux/slices/specializationSlice';
import { fetchTagsByUserId } from '../../redux/slices/tagSlice';
import { fetchContactsByUserId } from '../../redux/slices/contactSlice';
import {
    Container,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Box,
    Paper,
    Dialog,
    DialogContent,
} from '@mui/material';

const MentorProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.users.find(user => user.id === parseInt(id)));
    const faculties = useSelector((state) => state.faculties.faculties);
    const specializations = useSelector((state) => state.specializations.specializations);
    const tags = useSelector((state) => state.tags.tags);
    const contacts = useSelector((state) => state.contacts.contacts);

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(fetchUserById(id));
        dispatch(fetchFaculties());
        dispatch(fetchSpecializations());
        dispatch(fetchTagsByUserId(id)); // Fetch tags for the user
        dispatch(fetchContactsByUserId(id)); // Fetch contacts for the user
    }, [dispatch, id]);

    const apiUrl = 'http://localhost:7000'; // Ensure your API URL is correct

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const facultyName = faculties.find(faculty => faculty.id === user.facultyId)?.name || 'Unknown Faculty';
    const specializationName = specializations.find(specialization => specialization.id === user.specializationId)?.name || 'Unknown Specialization';

    const renderContactField = (label, value) => {
        if (!value || value === 'N/A') return null;
        const isLink = value.startsWith('http') || value.startsWith('https');
        return (
            <Typography variant="body2" gutterBottom>
                {label}: {isLink ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value}
            </Typography>
        );
    };

    const handleAvatarClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Avatar
                        src={user.avatar ? `${apiUrl}${user.avatar}` : ''}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 200, height: 200, cursor: 'pointer' }}
                        onClick={handleAvatarClick}
                    />
                    <Typography variant="h4" gutterBottom>
                        {`${user.firstName} ${user.lastName}`}
                    </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Email: {user.email}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Course: {user.course}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Record Book Number: {user.recordBookNumber}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Faculty: {facultyName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Specialization: {specializationName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Tags:
                </Typography>
                <List>
                    {tags && tags.length > 0 ? (
                        tags.map(tag => (
                            <ListItem key={tag.id}>
                                <ListItemText primary={tag.name} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2">No tags available</Typography>
                    )}
                </List>
                <Typography variant="h6" gutterBottom>
                    Contacts:
                </Typography>
                <List>
                    {contacts && contacts.length > 0 ? (
                        contacts.map(contact => (
                            <ListItem key={contact.id}>
                                <ListItemText
                                    primary={
                                        <>
                                            {renderContactField('VK', contact.vk)}
                                            {renderContactField('Telegram', contact.telegram)}
                                            {renderContactField('Phone', contact.phoneNumber)}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2">No contacts available</Typography>
                    )}
                </List>
            </Paper>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
                <DialogContent>
                    <img
                        src={user.avatar ? `${apiUrl}${user.avatar}` : ''}
                        alt={`${user.firstName} ${user.lastName}`}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default MentorProfile;
