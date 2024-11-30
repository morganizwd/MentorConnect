import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchForumById } from '../../redux/slices/forumSlice';
import { fetchPosts, createPost } from '../../redux/slices/postSlice';
import { fetchUserById } from '../../redux/slices/userSlice';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    Pagination,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Chip,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { Send as SendIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a8b 0%, #ff6a88 50%, #ff99ac 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    overflowX: 'hidden',
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(2),
    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    maxWidth: '1100px',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    },
}));

const MotionCard = motion(StyledCard);

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 6),
    backgroundColor: '#ff4081',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(255, 64, 129, 0.4)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        backgroundColor: '#e91e63',
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 30px rgba(233, 30, 99, 0.5)',
    },
}));

const Forum = () => {
    const apiUrl = 'http://localhost:7000'; // Базовый URL вашего бэкенда
    const { id } = useParams();
    const dispatch = useDispatch();
    const forum = useSelector((state) => state.forums.currentForum);
    const posts = useSelector((state) => state.posts.posts);
    const users = useSelector((state) => state.user.users);
    const currentUser = useSelector((state) => state.user.data);

    const [newPost, setNewPost] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        dispatch(fetchForumById(id));
        dispatch(fetchPosts());
    }, [dispatch, id]);

    useEffect(() => {
        posts.forEach((post) => {
            if (!users.find((user) => user.id === post.authorId)) {
                dispatch(fetchUserById(post.authorId));
            }
        });
    }, [posts, users, dispatch]);

    const handleCreatePost = () => {
        if (newPost.trim()) {
            dispatch(createPost({ content: newPost, forumId: id }))
                .unwrap()
                .then(() => {
                    setSnackbarMessage('Пост успешно создан');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                })
                .catch((err) => {
                    setSnackbarMessage('Ошибка при создании поста');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                });
            setNewPost('');
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handlePostsPerPageChange = (event) => {
        setPostsPerPage(event.target.value);
    };

    const sortedPosts = posts
        .filter((post) => post.forumId === parseInt(id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

    const listVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const getRoleColor = (role) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'error'; // Красный
            case 'mentor':
                return 'primary'; // Синий
            case 'mentee':
                return 'secondary'; // Фиолетовый
            default:
                return 'default'; // Серый
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <PageWrapper>
            <StyledContainer>
                {forum ? (
                    <>
                        {/* Заголовок */}
                        <HeaderSection>
                            <Typography variant="h3" sx={{ fontWeight: '700', color: '#333' }}>
                                {forum.title}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#555' }}>
                                {forum.description}
                            </Typography>
                        </HeaderSection>

                        {/* Создание нового поста (доступно только для определенных ролей) */}
                        {currentUser && (currentUser.role === 'mentor' || currentUser.role === 'mentee') && (
                            <Box sx={{ marginBottom: 4 }}>
                                <Typography variant="h5" gutterBottom>
                                    Добавить Пост
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={9}>
                                        <TextField
                                            label="Ваш текст"
                                            multiline
                                            rows={4}
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <StyledButton
                                            startIcon={<SendIcon />}
                                            onClick={handleCreatePost}
                                            fullWidth
                                        >
                                            Отправить
                                        </StyledButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Список постов */}
                        <AnimatePresence>
                            {currentPosts.map((post) => {
                                const author = users.find((user) => user.id === post.authorId);
                                return (
                                    <MotionCard
                                        key={post.id}
                                        variants={listVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        transition={{ duration: 0.4 }}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    src={author && author.avatar ? `${apiUrl}${author.avatar}` : ''}
                                                    alt={author ? `${author.firstName} ${author.lastName}` : 'Автор'}
                                                />
                                            }
                                            title={
                                                author ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="h6" sx={{ mr: 1 }}>
                                                            {author.firstName} {author.lastName}
                                                        </Typography>
                                                        <Chip
                                                            label={author.role}
                                                            color={getRoleColor(author.role)}
                                                            size="small"
                                                            sx={{ textTransform: 'capitalize' }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    `Автор ID: ${post.authorId}`
                                                )
                                            }
                                            subheader={new Date(post.createdAt).toLocaleString()}
                                        />
                                        <CardContent>
                                            <Typography>{post.content}</Typography>
                                        </CardContent>
                                    </MotionCard>
                                );
                            })}
                        </AnimatePresence>

                        {/* Пагинация */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={Math.ceil(sortedPosts.length / postsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6">Загрузка...</Typography>
                )}
            </StyledContainer>

            {/* Snackbar для уведомлений */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </PageWrapper>
    );
};

export default Forum;
