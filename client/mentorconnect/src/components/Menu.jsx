import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { selectIsAuth, logout } from '../redux/slices/userSlice';
import { markAllAsRead } from '../redux/slices/mentorshipSessionSlice';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Login as LoginIcon,
    PersonAdd as RegisterIcon,
    AccountCircle as ProfileIcon,
    Forum as ForumsIcon,
    Book as ResourcesIcon,
    Group as MentorsIcon,
    Event as SessionsIcon,
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
}));

const NavButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    color: '#333',
    fontWeight: 600,
    '&.active': {
        color: '#ff4081',
        borderBottom: '2px solid #ff4081',
    },
    '&:hover': {
        color: '#e91e63',
        backgroundColor: 'transparent',
    },
}));

const AdminSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
}));

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const currentUser = useSelector((state) => state.user.data);
    const newSessions = useSelector((state) => state.mentorshipSessions.newSessions);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/login');
    };

    const handleMySessionsClick = () => {
        dispatch(markAllAsRead());
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
    ];

    const authItems = [
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
        { text: 'Forums', icon: <ForumsIcon />, path: '/forums' },
        { text: 'Resources', icon: <ResourcesIcon />, path: '/resourses' },
        { text: 'Mentors', icon: <MentorsIcon />, path: '/mentors' },
        {
            text: 'My Sessions',
            icon: <SessionsIcon />,
            path: '/sessions',
            badge: newSessions.length,
            onClick: handleMySessionsClick,
        },
    ];

    const adminItems = [
        { text: 'Tags', icon: <AdminIcon />, path: '/admin/tags' },
        { text: 'Specializations', icon: <AdminIcon />, path: '/admin/specializations' },
        { text: 'Resources', icon: <AdminIcon />, path: '/admin/resources' },
        { text: 'Posts', icon: <AdminIcon />, path: '/admin/posts' },
        { text: 'Mentorship Sessions', icon: <AdminIcon />, path: '/admin/mentorship-sessions' },
        { text: 'Reviews', icon: <AdminIcon />, path: '/admin/reviews' },
        { text: 'Forums', icon: <AdminIcon />, path: '/admin/forums' },
        { text: 'Faculties', icon: <AdminIcon />, path: '/admin/faculties' },
        { text: 'Contacts', icon: <AdminIcon />, path: '/admin/contacts' },
    ];

    const guestItems = [
        { text: 'Login', icon: <LoginIcon />, path: '/login' },
        { text: 'Register', icon: <RegisterIcon />, path: '/register' },
    ];

    return (
        <>
            <StyledAppBar position="static" color="transparent">
                <StyledToolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: '700', color: '#ff4081' }}>
                            MentorConnect
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {menuItems.map((item) => (
                            <NavButton
                                key={item.text}
                                component={NavLink}
                                to={item.path}
                                activeClassName="active"
                            >
                                {item.text}
                            </NavButton>
                        ))}
                        {!isAuth && guestItems.map((item) => (
                            <NavButton
                                key={item.text}
                                component={NavLink}
                                to={item.path}
                                activeClassName="active"
                            >
                                {item.text}
                            </NavButton>
                        ))}
                        {isAuth && authItems.map((item) => (
                            <NavButton
                                key={item.text}
                                component={NavLink}
                                to={item.path}
                                activeClassName="active"
                                onClick={item.onClick}
                            >
                                {item.text}
                                {item.badge > 0 && (
                                    <Badge badgeContent={item.badge} color="error" sx={{ ml: 1 }} />
                                )}
                            </NavButton>
                        ))}
                        {isAuth && currentUser?.role === 'admin' && adminItems.map((item) => (
                            <NavButton
                                key={item.text}
                                component={NavLink}
                                to={item.path}
                                activeClassName="active"
                            >
                                {item.text}
                            </NavButton>
                        ))}
                        {isAuth && (
                            <IconButton onClick={handleLogout} sx={{ ml: 3 }} color="inherit">
                                <LogoutIcon />
                                <Typography variant="body1" sx={{ ml: 1 }}>
                                    Logout
                                </Typography>
                            </IconButton>
                        )}
                    </Box>
                    {/* Бургер-меню для мобильных устройств */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </StyledToolbar>
            </StyledAppBar>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.text} component={NavLink} to={item.path}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        {!isAuth && guestItems.map((item) => (
                            <ListItem button key={item.text} component={NavLink} to={item.path}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        {isAuth && authItems.map((item) => (
                            <ListItem button key={item.text} component={NavLink} to={item.path} onClick={item.onClick}>
                                <ListItemIcon>
                                    <Badge badgeContent={item.badge} color="error">
                                        {item.icon}
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        {isAuth && currentUser?.role === 'admin' && adminItems.map((item) => (
                            <ListItem button key={item.text} component={NavLink} to={item.path}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                    {isAuth && (
                        <>
                            <Divider />
                            <List>
                                <ListItem button onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </List>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Menu;
