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
    Box,
    Paper,
    Button,
    Dialog,
    DialogContent,
    TextField,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Rating,
    Chip,
    Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { Email, School, Tag, ContactPhone, Comment, Event } from '@mui/icons-material';

const GradientBackground = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF9A8B, #FAD961, #9CECFB, #92FE9D)',
    backgroundSize: '400% 400%',
    animation: 'gradientAnimation 15s ease infinite',
    minHeight: '100vh',
    padding: theme.spacing(4),
    '@keyframes gradientAnimation': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    color: '#333',
    marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: '5px solid #fff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
    },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    background: 'rgba(250, 250, 250, 0.9)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
}));

const GradientButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1, 4),
    borderRadius: theme.spacing(3),
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0 6px 20px rgba(118, 75, 162, 0.5)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #764ba2, #667eea)',
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 30px rgba(118, 75, 162, 0.7)',
    },
}));

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

    useEffect(() => {
        dispatch(fetchUserById(id));
        dispatch(fetchFaculties());
        dispatch(fetchSpecializations());
        dispatch(fetchTagsByUserId(id));
        dispatch(fetchContactsByUserId(id));
        dispatch(fetchMentorshipSessions());
        dispatch(fetchMentorReviews());
    }, [dispatch, id]);

    const facultyName = faculties.find(faculty => faculty.id === user.facultyId)?.name || 'Unknown Faculty';
    const specializationName = specializations.find(spec => spec.id === user.specializationId)?.name || 'Unknown Specialization';
    const completedSessionsCount = sessions.filter(session => session.mentorId === parseInt(id) && session.isFinished).length;

    const renderContacts = () => {
        return contacts.map(contact => (
            <Chip
                icon={<ContactPhone />}
                key={contact.id}
                label={contact.phoneNumber || 'Contact'}
                color="primary"
                sx={{ marginRight: 1, marginBottom: 1 }}
            />
        ));
    };

    const renderTags = () => {
        return tags.map(tag => (
            <Chip
                icon={<Tag />}
                key={tag.id}
                label={tag.name}
                color="secondary"
                sx={{ marginRight: 1, marginBottom: 1 }}
            />
        ));
    };

    return (
        <GradientBackground>
            <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <StyledAvatar
                        src={user?.avatar || ''}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        onClick={() => setOpenDialog(true)}
                    />
                    <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                        {`${user?.firstName} ${user?.lastName}`}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: 'gray' }}>
                        {specializationName}, {facultyName}
                    </Typography>
                </Box>
            </StyledPaper>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <Typography variant="h6" gutterBottom>
                            <Email /> Email
                        </Typography>
                        <Typography>{user?.email || 'Not provided'}</Typography>
                    </InfoCard>
                    <InfoCard>
                        <Typography variant="h6" gutterBottom>
                            <School /> Completed Sessions
                        </Typography>
                        <Typography>{completedSessionsCount}</Typography>
                    </InfoCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <Typography variant="h6" gutterBottom>
                            <Tag /> Tags
                        </Typography>
                        <Box>{renderTags()}</Box>
                    </InfoCard>
                    <InfoCard>
                        <Typography variant="h6" gutterBottom>
                            <ContactPhone /> Contacts
                        </Typography>
                        <Box>{renderContacts()}</Box>
                    </InfoCard>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
                <DialogContent>
                    <img
                        src={user?.avatar || ''}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        style={{ width: '100%', borderRadius: '10px' }}
                    />
                </DialogContent>
            </Dialog>
        </GradientBackground>
    );
};

export default MentorProfile;
