import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAuthMe,
    fetchUserById
} from '../../redux/slices/userSlice';
import {
    fetchMentorshipSessions,
    updateMentorshipSession,
    deleteMentorshipSession,
    markAllAsRead
} from '../../redux/slices/mentorshipSessionSlice';
import {
    createMentorReview,
    fetchMentorReviews
} from '../../redux/slices/mentorReviewSlice';
import {
    createMenteeReview,
    fetchMenteeReviews
} from '../../redux/slices/menteeReviewSlice';
import {
    Container,
    Typography,
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
    Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Стили
const GradientBackground = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FAD961, #F76B1C, #FF9A8B, #667eea)',
    backgroundSize: '400% 400%',
    animation: 'gradient-animation 15s ease infinite',
    minHeight: '100vh',
    padding: theme.spacing(4),
    '@keyframes gradient-animation': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
}));

const SessionCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    fontWeight: 'bold',
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(3),
    boxShadow: '0 6px 20px rgba(118, 75, 162, 0.5)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        background: 'linear-gradient(135deg, #764ba2, #667eea)',
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 30px rgba(118, 75, 162, 0.7)',
    },
}));

const MySessions = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.data);
    const sessions = useSelector((state) => state.mentorshipSessions.sessions);
    const users = useSelector((state) => state.user.users);
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
        dispatch(markAllAsRead());
    }, [dispatch]);

    if (!currentUser) {
        return (
            <Typography variant="h6" align="center">
                Loading...
            </Typography>
        );
    }

    const sortedSessions = sessions
        .filter(session => session.mentorId === currentUser.id || session.menteeId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleSave = (id) => {
        dispatch(updateMentorshipSession({
            id,
            sessionData: {
                scheduledTime: newScheduledTime,
                isFinished: newStatus
            }
        }));
        setEditingSession(null);
    };

    const handleDelete = (id) => {
        dispatch(deleteMentorshipSession(id));
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);

    return (
        <GradientBackground>
            <Container>
                <Typography variant="h3" align="center" sx={{ mb: 4, color: '#fff', fontWeight: 'bold' }}>
                    My Mentorship Sessions
                </Typography>
                <Grid container spacing={3}>
                    {currentSessions.map(session => {
                        const mentor = users.find(user => user.id === session.mentorId);
                        const mentee = users.find(user => user.id === session.menteeId);

                        return (
                            <Grid item xs={12} key={session.id}>
                                <SessionCard>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Session with {mentor?.firstName} {mentor?.lastName} and {mentee?.firstName} {mentee?.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        Scheduled Time: {new Date(session.scheduledTime).toLocaleString()}
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={() => setEditingSession(session)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(session.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    {editingSession?.id === session.id && (
                                        <Box sx={{ mt: 2 }}>
                                            <TextField
                                                label="Scheduled Time"
                                                type="datetime-local"
                                                value={newScheduledTime}
                                                onChange={(e) => setNewScheduledTime(e.target.value)}
                                                fullWidth
                                            />
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                >
                                                    <MenuItem value={true}>Finished</MenuItem>
                                                    <MenuItem value={false}>Ongoing</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <GradientButton
                                                onClick={() => handleSave(session.id)}
                                                sx={{ mt: 2 }}
                                            >
                                                Save
                                            </GradientButton>
                                        </Box>
                                    )}
                                </SessionCard>
                            </Grid>
                        );
                    })}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(sortedSessions.length / sessionsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>
            </Container>
        </GradientBackground>
    );
};

export default MySessions;
