import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGetAllUsers } from '../../redux/slices/userSlice';
import { fetchTags } from '../../redux/slices/tagSlice';
import {
    Container,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    Box,
    Chip,
    Avatar,
    Paper,
    Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Стилизация
const GradientBackground = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF8A80, #FF80AB, #82B1FF, #80D8FF)',
    backgroundSize: '400% 400%',
    animation: 'gradient-animation 10s ease infinite',
    minHeight: '100vh',
    padding: theme.spacing(4),
    '@keyframes gradient-animation': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#333',
}));

const MentorCard = styled(ListItem)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    background: 'linear-gradient(135deg, #FF9A8B, #FAD961)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    },
}));

const TagChip = styled(Chip)(({ theme, selected }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: selected ? '#6200EA' : '#BB86FC',
    color: '#fff',
    '&:hover': {
        backgroundColor: selected ? '#3700B3' : '#8C9EFF',
    },
}));

const MentorSearch = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const tags = useSelector((state) => state.tags.tags);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        dispatch(fetchGetAllUsers());
        dispatch(fetchTags());
    }, [dispatch]);

    // Фильтрация менторов
    const filteredMentors = users.filter(user => {
        if (user.role !== 'mentor') return false;
        if (
            searchTerm &&
            !user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }
        if (selectedTag && !user.tags.map(tag => tag.name).includes(selectedTag.name)) {
            return false;
        }
        return true;
    });

    const apiUrl = 'http://localhost:7000';

    return (
        <GradientBackground>
            <StyledPaper>
                {/* Заголовок и описание */}
                <Typography variant="h3" align="center" gutterBottom sx={{ color: '#6200EA', fontWeight: 'bold' }}>
                    Найдите своего ментора
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3, color: '#333' }}>
                    Используйте поиск по имени или выберите интересующий вас тег, чтобы найти идеального наставника для вашего роста и развития!
                </Typography>

                {/* Поле поиска */}
                <TextField
                    fullWidth
                    label="Введите имя или фамилию"
                    placeholder="Иван Иванов"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiInputBase-root': {
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                        },
                    }}
                />

                {/* Секция тегов */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
                    {tags.map(tag => (
                        <TagChip
                            key={tag.id}
                            label={tag.name}
                            onClick={() => setSelectedTag(tag)}
                            selected={selectedTag && selectedTag.id === tag.id}
                            onDelete={selectedTag && selectedTag.id === tag.id ? () => setSelectedTag(null) : null}
                        />
                    ))}
                </Box>

                {/* Список менторов */}
                <Grid container spacing={3}>
                    {filteredMentors.length > 0 ? (
                        filteredMentors.map(mentor => (
                            <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                                <MentorCard
                                    component={Link}
                                    to={`/mentors/${mentor.id}`}
                                    sx={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Avatar
                                        src={mentor.avatar ? `${apiUrl}${mentor.avatar}` : ''}
                                        alt={`${mentor.firstName} ${mentor.lastName}`}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            marginRight: 2,
                                            border: '2px solid #fff',
                                        }}
                                    />
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                {mentor.firstName} {mentor.lastName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                {mentor.email}
                                            </Typography>
                                        }
                                    />
                                </MentorCard>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" align="center" sx={{ color: '#FF3D00', width: '100%' }}>
                            Менторы не найдены. Попробуйте изменить параметры поиска.
                        </Typography>
                    )}
                </Grid>
            </StyledPaper>
        </GradientBackground>
    );
};

export default MentorSearch;
