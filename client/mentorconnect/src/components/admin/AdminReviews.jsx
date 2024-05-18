import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMentorReviews,
    createMentorReview,
    updateMentorReview,
    deleteMentorReview,
} from '../../redux/slices/mentorReviewSlice';
import {
    fetchMenteeReviews,
    createMenteeReview,
    updateMenteeReview,
    deleteMenteeReview,
} from '../../redux/slices/menteeReviewSlice';
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
    ListItemSecondaryAction,
    Tabs,
    Tab,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const AdminReviews = () => {
    const dispatch = useDispatch();
    const mentorReviews = useSelector((state) => state.mentorReviews.reviews);
    const menteeReviews = useSelector((state) => state.menteeReviews.reviews);
    const [tabIndex, setTabIndex] = useState(0);
    const [form, setForm] = useState({
        comment: '',
        rating: '',
        mentorshipSessionId: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [currentReviewType, setCurrentReviewType] = useState('mentor');

    useEffect(() => {
        dispatch(fetchMentorReviews());
        dispatch(fetchMenteeReviews());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentReviewType === 'mentor') {
            if (editingId) {
                dispatch(updateMentorReview({ id: editingId, reviewData: form }));
            } else {
                dispatch(createMentorReview(form));
            }
        } else {
            if (editingId) {
                dispatch(updateMenteeReview({ id: editingId, reviewData: form }));
            } else {
                dispatch(createMenteeReview(form));
            }
        }

        setForm({
            comment: '',
            rating: '',
            mentorshipSessionId: '',
        });
        setEditingId(null);
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setForm({
            comment: review.comment,
            rating: review.rating,
            mentorshipSessionId: review.mentorshipSessionId,
        });
    };

    const handleDelete = (id, reviewType) => {
        if (reviewType === 'mentor') {
            dispatch(deleteMentorReview(id));
        } else {
            dispatch(deleteMenteeReview(id));
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setCurrentReviewType(newValue === 0 ? 'mentor' : 'mentee');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Reviews
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Mentor Reviews" />
                <Tab label="Mentee Reviews" />
            </Tabs>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="comment"
                    label="Comment"
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="rating"
                    label="Rating"
                    name="rating"
                    type="number"
                    inputProps={{ min: 1, max: 5 }}
                    value={form.rating}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="mentorshipSessionId"
                    label="Mentorship Session ID"
                    name="mentorshipSessionId"
                    value={form.mentorshipSessionId}
                    onChange={handleChange}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {editingId ? 'Update Review' : 'Create Review'}
                </Button>
            </Box>
            {tabIndex === 0 && (
                <List>
                    {mentorReviews.map((review) => (
                        <ListItem key={review.id}>
                            <ListItemText
                                primary={`Rating: ${review.rating}`}
                                secondary={`Comment: ${review.comment}, Session ID: ${review.mentorshipSessionId}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(review)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(review.id, 'mentor')}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
            {tabIndex === 1 && (
                <List>
                    {menteeReviews.map((review) => (
                        <ListItem key={review.id}>
                            <ListItemText
                                primary={`Rating: ${review.rating}`}
                                secondary={`Comment: ${review.comment}, Session ID: ${review.mentorshipSessionId}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(review)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(review.id, 'mentee')}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default AdminReviews;