import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../../redux/slices/userSlice';
import { fetchFaculties } from '../../redux/slices/facultySlice';
import { fetchSpecializations } from '../../redux/slices/specializationSlice';
import { fetchTagsByUserId } from '../../redux/slices/tagSlice';
import { fetchContactsByUserId } from '../../redux/slices/contactSlice';
import { fetchMentorshipSessions, createMentorshipSession } from '../../redux/slices/mentorshipSessionSlice';
import { fetchMentorReviews } from '../../redux/slices/mentorReviewSlice';
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
    Button,
    TextField,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Rating,
} from '@mui/material';

const MentorProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.users.find(user => user.id === parseInt(id)));
    const faculties = useSelector((state) => state.faculties.faculties);
    const specializations = useSelector((state) => state.specializations.specializations);
    const tags = useSelector((state) => state.tags.tags);
    const contacts = useSelector((state) => state.contacts.contacts);
    const currentUser = useSelector((state) => state.user.data);
    const sessions = useSelector((state) => state.mentorshipSessions.sessions);
    const mentorReviews = useSelector((state) => state.mentorReviews.reviews);

    const [openDialog, setOpenDialog] = useState(false);
    const [openSessionDialog, setOpenSessionDialog] = useState(false);
    const [sessionData, setSessionData] = useState({
        scheduledTime: '',
        isFinished: false,
        mentorId: parseInt(id),
        menteeId: null
    });

    useEffect(() => {
        dispatch(fetchUserById(id));
        dispatch(fetchFaculties());
        dispatch(fetchSpecializations());
        dispatch(fetchTagsByUserId(id)); // Fetch tags for the user
        dispatch(fetchContactsByUserId(id)); // Fetch contacts for the user
        dispatch(fetchMentorshipSessions());
        dispatch(fetchMentorReviews());
    }, [dispatch, id]);

    useEffect(() => {
        if (currentUser) {
            setSessionData(prevState => ({ ...prevState, menteeId: currentUser.id }));
        }
    }, [currentUser]);

    const apiUrl = 'http://localhost:7000'; // Ensure your API URL is correct

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const facultyName = faculties.find(faculty => faculty.id === user.facultyId)?.name || 'Unknown Faculty';
    const specializationName = specializations.find(specialization => specialization.id === user.specializationId)?.name || 'Unknown Specialization';

    const completedSessionsCount = sessions.filter(session => session.mentorId === parseInt(id) && session.isFinished).length;

    // Filter reviews where the session's mentorId matches the user's id
    const mentorRelatedReviews = mentorReviews.filter(review => {
        const session = sessions.find(session => session.id === review.mentorshipSessionId);
        return session && session.mentorId === parseInt(id);
    });

    const renderContactField = (label, value) => {
        if (!value || value === 'N/A') return null;
        const isLink = value.startsWith('http') || value.startsWith('https');
        return (
            <Typography variant="body2" gutterBottom>
                {label}: {isLink ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value}
            </Typography>
        );
    };

    const renderContacts = (userId) => {
        const userContacts = contacts.filter(contact => contact.userId === userId);
        return userContacts.length > 0 ? (
            userContacts.map(contact => (
                <Box key={contact.id} sx={{ marginBottom: 1 }}>
                    {contact.vk && <Typography variant="body2">VK: <a href={contact.vk} target="_blank" rel="noopener noreferrer">{contact.vk}</a></Typography>}
                    {contact.telegram && <Typography variant="body2">Telegram: <a href={contact.telegram} target="_blank" rel="noopener noreferrer">{contact.telegram}</a></Typography>}
                    {contact.phoneNumber && <Typography variant="body2">Phone: {contact.phoneNumber}</Typography>}
                </Box>
            ))
        ) : <Typography variant="body2">No contacts available</Typography>;
    };

    const renderReviews = () => {
        return (
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Reviews:</Typography>
                {mentorRelatedReviews.length > 0 ? (
                    mentorRelatedReviews.map(review => (
                        <Paper key={review.id} sx={{ padding: 2, marginBottom: 2 }}>
                            <Typography variant="body2">Comment: {review.comment}</Typography>
                            <Rating value={review.rating} readOnly />
                        </Paper>
                    ))
                ) : (
                    <Typography variant="body2">No reviews available</Typography>
                )}
            </Box>
        );
    };

    const handleAvatarClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenSessionDialog = () => {
        setOpenSessionDialog(true);
    };

    const handleCloseSessionDialog = () => {
        setOpenSessionDialog(false);
    };

    const handleSessionChange = (e) => {
        const { name, value } = e.target;
        setSessionData({ ...sessionData, [name]: value });
    };

    const handleCreateSession = () => {
        dispatch(createMentorshipSession(sessionData)).then(() => {
            setOpenSessionDialog(false);
            dispatch(fetchContactsByUserId(id));
        });
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
                    {currentUser && currentUser.role === 'mentee' && (
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleOpenSessionDialog}>
                            Create Session
                        </Button>
                    )}
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
                    Completed Sessions: {completedSessionsCount}
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
                    {renderContacts(user.id)}
                </List>
                {renderReviews()}
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
            <Dialog open={openSessionDialog} onClose={handleCloseSessionDialog}>
                <DialogTitle>Create Mentorship Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new mentorship session, please enter the details below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="scheduledTime"
                        label="Scheduled Time"
                        type="datetime-local"
                        fullWidth
                        variant="outlined"
                        name="scheduledTime"
                        value={sessionData.scheduledTime}
                        onChange={handleSessionChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSessionDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSession} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MentorProfile;
