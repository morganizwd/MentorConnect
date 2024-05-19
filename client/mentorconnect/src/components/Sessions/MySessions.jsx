import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, fetchUserById } from '../../redux/slices/userSlice';
import { fetchMentorshipSessions, updateMentorshipSession, deleteMentorshipSession, markAllAsRead } from '../../redux/slices/mentorshipSessionSlice';
import { fetchContactsByUserId } from '../../redux/slices/contactSlice';
import { createMentorReview, fetchMentorReviews } from '../../redux/slices/mentorReviewSlice';
import { createMenteeReview, fetchMenteeReviews } from '../../redux/slices/menteeReviewSlice';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    Box,
    IconButton,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Rating,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const MySessions = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.data);
    const sessions = useSelector((state) => state.mentorshipSessions.sessions);
    const users = useSelector((state) => state.user.users);
    const contacts = useSelector((state) => state.contacts.contacts);
    const mentorReviews = useSelector((state) => state.mentorReviews.reviews);
    const menteeReviews = useSelector((state) => state.menteeReviews.reviews);
    const [editingSession, setEditingSession] = useState(null);
    const [newScheduledTime, setNewScheduledTime] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const sessionsPerPage = 5;
    const [reviewData, setReviewData] = useState({ comment: '', rating: 0 });

    useEffect(() => {
        dispatch(fetchAuthMe());
        dispatch(fetchMentorshipSessions());
        dispatch(fetchMentorReviews());
        dispatch(fetchMenteeReviews());
    }, [dispatch]);

    useEffect(() => {
        if (sessions.length > 0) {
            sessions.forEach(session => {
                dispatch(fetchUserById(session.mentorId));
                dispatch(fetchUserById(session.menteeId));
                dispatch(fetchContactsByUserId(session.mentorId));
                dispatch(fetchContactsByUserId(session.menteeId));
            });
        }
    }, [sessions, dispatch]);

    useEffect(() => {
        dispatch(markAllAsRead());
    }, [dispatch]);

    if (!currentUser) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const sortedSessions = sessions
        .filter(session => session.mentorId === currentUser.id || session.menteeId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleEdit = (session) => {
        setEditingSession(session);
        setNewScheduledTime(session.scheduledTime);
        setNewStatus(session.isFinished);
    };

    const handleSave = (id) => {
        dispatch(updateMentorshipSession({
            id,
            sessionData: {
                scheduledTime: newScheduledTime,
                isFinished: newStatus
            }
        }));
        setEditingSession(null);
        setNewScheduledTime('');
        setNewStatus('');
    };

    const handleDelete = (id) => {
        dispatch(deleteMentorshipSession(id));
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, [name]: value });
    };

    const handleReviewSubmit = (session, userType) => {
        const reviewPayload = {
            comment: reviewData.comment,
            rating: reviewData.rating,
            mentorshipSessionId: session.id,
        };

        if (userType === 'mentor') {
            dispatch(createMenteeReview(reviewPayload));
        } else if (userType === 'mentee') {
            dispatch(createMentorReview(reviewPayload));
        }

        setReviewData({ comment: '', rating: 0 });
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

    const renderReviews = (session) => {
        const sessionMentorReviews = mentorReviews.filter(review => review.mentorshipSessionId === session.id);
        const sessionMenteeReviews = menteeReviews.filter(review => review.mentorshipSessionId === session.id);

        return (
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Reviews:</Typography>
                {sessionMentorReviews.length > 0 && (
                    <>
                        <Typography variant="subtitle1">Mentor Reviews:</Typography>
                        {sessionMentorReviews.map(review => (
                            <Paper key={review.id} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="body2">Comment: {review.comment}</Typography>
                                <Typography variant="body2">Rating: {review.rating}</Typography>
                            </Paper>
                        ))}
                    </>
                )}
                {sessionMenteeReviews.length > 0 && (
                    <>
                        <Typography variant="subtitle1">Mentee Reviews:</Typography>
                        {sessionMenteeReviews.map(review => (
                            <Paper key={review.id} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="body2">Comment: {review.comment}</Typography>
                                <Typography variant="body2">Rating: {review.rating}</Typography>
                            </Paper>
                        ))}
                    </>
                )}
                {sessionMentorReviews.length === 0 && sessionMenteeReviews.length === 0 && (
                    <Typography variant="body2">No reviews available</Typography>
                )}
            </Box>
        );
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Typography variant="h4" gutterBottom>
                    My Mentorship Sessions
                </Typography>
                <List>
                    {currentSessions.length > 0 ? (
                        currentSessions.map(session => {
                            const mentor = users.find(user => user.id === session.mentorId);
                            const mentee = users.find(user => user.id === session.menteeId);
                            const isFinished = session.isFinished;

                            return (
                                <ListItem key={session.id} sx={{ marginBottom: 2 }}>
                                    <Paper elevation={1} sx={{ padding: 2, width: '100%' }}>
                                        <ListItemText
                                            primary={`Session with Mentor: ${mentor?.firstName} ${mentor?.lastName} and Mentee: ${mentee?.firstName} ${mentee?.lastName}`}
                                            secondary={
                                                <>
                                                    <Typography variant="body2">
                                                        Created At: {new Date(session.createdAt).toLocaleString()}
                                                    </Typography>
                                                    {editingSession?.id === session.id ? (
                                                        <>
                                                            <TextField
                                                                label="Scheduled Time"
                                                                type="datetime-local"
                                                                value={newScheduledTime}
                                                                onChange={(e) => setNewScheduledTime(e.target.value)}
                                                                sx={{ marginBottom: 2 }}
                                                                fullWidth
                                                            />
                                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                                <InputLabel>Status</InputLabel>
                                                                <Select
                                                                    value={newStatus}
                                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                                >
                                                                    <MenuItem value={true}>Finished</MenuItem>
                                                                    <MenuItem value={false}>Ongoing</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <Button variant="contained" onClick={() => handleSave(session.id)}>Save</Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Typography variant="body2">
                                                                Scheduled Time: {new Date(session.scheduledTime).toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Status: {isFinished ? 'Finished' : 'Ongoing'}
                                                            </Typography>
                                                            <IconButton onClick={() => handleEdit(session)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                    <IconButton onClick={() => handleDelete(session.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Box sx={{ marginTop: 2 }}>
                                                        <Typography variant="h6">Mentor Contacts:</Typography>
                                                        {renderContacts(session.mentorId)}
                                                    </Box>
                                                    <Box sx={{ marginTop: 2 }}>
                                                        <Typography variant="h6">Mentee Contacts:</Typography>
                                                        {renderContacts(session.menteeId)}
                                                    </Box>
                                                    {isFinished && (
                                                        <Box sx={{ marginTop: 2 }}>
                                                            <Typography variant="h6">Leave a Review</Typography>
                                                            <TextField
                                                                label="Comment"
                                                                name="comment"
                                                                value={reviewData.comment}
                                                                onChange={handleReviewChange}
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                sx={{ marginBottom: 2 }}
                                                            />
                                                            <Rating
                                                                name="rating"
                                                                value={reviewData.rating}
                                                                onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
                                                                precision={0.5}
                                                                sx={{ marginBottom: 2 }}
                                                            />
                                                            {currentUser.id === session.mentorId ? (
                                                                <Button variant="contained" onClick={() => handleReviewSubmit(session, 'mentor')}>Submit Review for Mentee</Button>
                                                            ) : (
                                                                <Button variant="contained" onClick={() => handleReviewSubmit(session, 'mentee')}>Submit Review for Mentor</Button>
                                                            )}
                                                        </Box>
                                                    )}
                                                    {renderReviews(session)}
                                                </>
                                            }
                                        />
                                    </Paper>
                                </ListItem>
                            );
                        })
                    ) : (
                        <Typography variant="body2">No sessions available</Typography>
                    )}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <Pagination
                        count={Math.ceil(sortedSessions.length / sessionsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default MySessions;
