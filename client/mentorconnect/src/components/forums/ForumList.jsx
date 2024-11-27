import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { fetchForums, createForum } from '../../redux/slices/forumSlice';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    InputAdornment,
    IconButton,
    Paper,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a8b 0%, #ff6a88 50%, #ff99ac 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(3),
    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    maxWidth: '1100px',
    width: '100%',
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

const ForumList = () => {
    const dispatch = useDispatch();
    const forums = useSelector((state) => state.forums.forums);
    const status = useSelector((state) => state.forums.status);
    const error = useSelector((state) => state.forums.error);

    const [searchTitle, setSearchTitle] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [newForumTitle, setNewForumTitle] = useState('');
    const [newForumDescription, setNewForumDescription] = useState('');

    useEffect(() => {
        dispatch(fetchForums());
    }, [dispatch]);

    const handleCreateForum = () => {
        if (newForumTitle.trim() && newForumDescription.trim()) {
            dispatch(createForum({ title: newForumTitle, description: newForumDescription }));
            setNewForumTitle('');
            setNewForumDescription('');
        }
    };

    const filteredForums = forums.filter((forum) =>
        forum.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        forum.description.toLowerCase().includes(searchDescription.toLowerCase())
    );

    const listItemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <PageWrapper>
            <StyledContainer>
                {/* Заголовок */}
                <HeaderSection>
                    <Typography variant="h3" sx={{ fontWeight: '700', color: '#333' }}>
                        Добро пожаловать в наши Форумы
                    </Typography>
                </HeaderSection>

                {/* Поисковая секция */}
                <Box sx={{ marginBottom: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Поиск по Названию"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Поиск по Описанию"
                                value={searchDescription}
                                onChange={(e) => setSearchDescription(e.target.value)}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Создание нового форума */}
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Создать новый Форум
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Название Форума"
                                value={newForumTitle}
                                onChange={(e) => setNewForumTitle(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Описание Форума"
                                value={newForumDescription}
                                onChange={(e) => setNewForumDescription(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <StyledButton
                                startIcon={<AddIcon />}
                                onClick={handleCreateForum}
                                fullWidth
                            >
                                Создать
                            </StyledButton>
                        </Grid>
                    </Grid>
                </Box>

                {/* Список форумов */}
                <AnimatePresence>
                    {filteredForums.map((forum) => (
                        <motion.div
                            key={forum.id}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.4 }}
                        >
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {forum.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {forum.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        component={RouterLink}
                                        to={`/forums/${forum.id}`}
                                        color="secondary"
                                    >
                                        Подробнее
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Состояние загрузки и ошибки */}
                {status === 'loading' && (
                    <Typography variant="h6" align="center">
                        Загрузка...
                    </Typography>
                )}
                {error && (
                    <Typography variant="h6" color="error" align="center">
                        Ошибка: {error}
                    </Typography>
                )}
            </StyledContainer>
        </PageWrapper>
    );
};

export default ForumList;