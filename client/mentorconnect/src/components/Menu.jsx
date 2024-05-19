import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { selectIsAuth, logout } from '../redux/slices/userSlice';
import { markAllAsRead } from '../redux/slices/mentorshipSessionSlice';
import { Box, Button, Typography, Badge } from '@mui/material';

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector((state) => state.user.data);
    const newSessions = useSelector((state) => state.mentorshipSessions.newSessions);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/login');
    };

    const handleMySessionsClick = () => {
        dispatch(markAllAsRead());
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Menu
            </Typography>
            <Button component={NavLink} to="/" sx={{ marginBottom: 1 }}>
                Home
            </Button>
            {!isAuth && (
                <>
                    <Button component={NavLink} to="/login" sx={{ marginBottom: 1 }}>
                        Login
                    </Button>
                    <Button component={NavLink} to="/register" sx={{ marginBottom: 1 }}>
                        Register
                    </Button>
                </>
            )}
            {isAuth && (
                <>
                    <Button component={NavLink} to="/profile" sx={{ marginBottom: 1 }}>
                        Profile
                    </Button>
                    <Button component={NavLink} to="/forums" sx={{ marginBottom: 1 }}>
                        Forums
                    </Button>
                    <Button component={NavLink} to="/resourses" sx={{ marginBottom: 1 }}>
                        Resources
                    </Button>
                    <Button component={NavLink} to="/mentors" sx={{ marginBottom: 1 }}>
                        Mentors
                    </Button>
                    <Button
                        component={NavLink}
                        to="/sessions"
                        sx={{ marginBottom: 1 }}
                        onClick={handleMySessionsClick}
                    >
                        My Sessions
                        {newSessions.length > 0 && (
                            <Badge badgeContent={newSessions.length} color="error" sx={{ marginLeft: 1 }} />
                        )}
                    </Button>
                    {currentUser?.role === 'admin' && (
                        <>
                            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                                Admin Menu
                            </Typography>
                            <Button component={NavLink} to="/admin/tags" sx={{ marginBottom: 1 }}>
                                Tags
                            </Button>
                            <Button component={NavLink} to="/admin/specializations" sx={{ marginBottom: 1 }}>
                                Specializations
                            </Button>
                            <Button component={NavLink} to="/admin/resources" sx={{ marginBottom: 1 }}>
                                Resources
                            </Button>
                            <Button component={NavLink} to="/admin/posts" sx={{ marginBottom: 1 }}>
                                Posts
                            </Button>
                            <Button component={NavLink} to="/admin/mentorship-sessions" sx={{ marginBottom: 1 }}>
                                Mentorship Sessions
                            </Button>
                            <Button component={NavLink} to="/admin/reviews" sx={{ marginBottom: 1 }}>
                                Reviews
                            </Button>
                            <Button component={NavLink} to="/admin/forums" sx={{ marginBottom: 1 }}>
                                Forums
                            </Button>
                            <Button component={NavLink} to="/admin/faculties" sx={{ marginBottom: 1 }}>
                                Faculties
                            </Button>
                            <Button component={NavLink} to="/admin/contacts" sx={{ marginBottom: 1 }}>
                                Contacts
                            </Button>
                        </>
                    )}
                    <Button onClick={handleLogout} sx={{ marginBottom: 1 }}>
                        Logout
                    </Button>
                </>
            )}
        </Box>
    );
};

export default Menu;
