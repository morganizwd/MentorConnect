import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchResources,
    createResource,
    deleteResource,
} from '../../redux/slices/resourceSlice';
import { fetchGetAllUsers } from '../../redux/slices/userSlice';
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
    IconButton,
    InputAdornment,
    CircularProgress,
    Stack,
} from '@mui/material';
import { Delete as DeleteIcon, GetApp as GetAppIcon, Upload as UploadIcon, Search as SearchIcon, Info as InfoIcon } from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../redux/axios';

// Keyframes for animated background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a8b, #fcb69f, #84fab0, #8fd3f4)',
    backgroundSize: '400% 400%',
    animation: `${gradientAnimation} 10s ease infinite`,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(15px)',
    maxWidth: '900px',
    textAlign: 'center',
}));

const WelcomeBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(4),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'perspective(1000px) rotateX(0deg)',
    transition: 'transform 0.4s ease, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'perspective(1000px) rotateX(3deg)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5, 4),
    backgroundColor: '#3f51b5',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1.1rem',
    borderRadius: theme.spacing(2),
    boxShadow: '0 6px 18px rgba(63, 81, 181, 0.4)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        backgroundColor: '#303f9f',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 24px rgba(48, 63, 159, 0.5)',
    },
}));

const MotionCard = motion(StyledCard);

const Resources = () => {
    const dispatch = useDispatch();
    const resources = useSelector((state) => state.resources.resources);
    const status = useSelector((state) => state.resources.status);
    const error = useSelector((state) => state.resources.error);
    const users = useSelector((state) => state.user.users);
    const isAuth = useSelector((state) => state.user.data);

    const [form, setForm] = useState({
        title: '',
        description: '',
        file: null,
    });
    const [filters, setFilters] = useState({
        title: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        dispatch(fetchResources());
        dispatch(fetchGetAllUsers());
    }, [dispatch]);

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        dispatch(createResource(formData));

        setForm({
            title: '',
            description: '',
            file: null,
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteResource(id));
    };

    const handleDownload = async (id, title) => {
        try {
            const response = await axios.get(`/resources/${id}/download`, {
                responseType: 'blob',
            });

            // Извлечение заголовка Content-Disposition
            const disposition = response.headers['content-disposition'];
            console.log('Content-Disposition:', disposition); // Отладка
            let filename = 'file'; // Значение по умолчанию

            if (disposition && disposition.includes('attachment')) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            } else {
                // Если заголовок отсутствует, можно использовать title и добавить расширение
                filename = `${title}`;
            }

            console.log('Extracted filename:', filename); // Отладка

            const blob = new Blob([response.data], { type: response.data.type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Освобождение памяти
        } catch (err) {
            console.error('Error downloading file', err);
        }
    };

    const getAuthorNameById = (id) => {
        const author = users.find((user) => user.id === id);
        return author ? `${author.firstName} ${author.lastName}` : 'Unknown Author';
    };

    const filterResources = () => {
        return resources.filter((resource) => {
            const matchesTitle = filters.title ? resource.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
            const matchesStartDate = filters.startDate ? new Date(resource.createdAt) >= new Date(filters.startDate) : true;
            const matchesEndDate = filters.endDate ? new Date(resource.createdAt) <= new Date(filters.endDate) : true;

            return matchesTitle && matchesStartDate && matchesEndDate;
        });
    };

    return (
        <PageWrapper>
            <StyledContainer>
                {/* Приветственный Блок */}
                <WelcomeBox>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <InfoIcon color="primary" fontSize="large" />
                        <Typography variant="h5" component="div">
                            Добро пожаловать в раздел ресурсов!
                        </Typography>
                    </Stack>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Здесь вы можете добавлять, просматривать и скачивать полезные материалы.
                        </Typography>
                        {isAuth && (
                            <Typography variant="body1" gutterBottom>
                                Если вы являетесь авторизованным пользователем, у вас есть возможность добавлять новые ресурсы или удалять существующие.
                            </Typography>
                        )}
                        <Typography variant="body1" gutterBottom>
                            Используйте фильтры ниже, чтобы быстро находить нужные материалы по названию или дате создания.
                        </Typography>
                    </Box>
                </WelcomeBox>

                {/* Форма Добавления Ресурса */}
                {isAuth && (
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Добавьте новый ресурс
                        </Typography>
                        <TextField
                            label="Название"
                            name="title"
                            fullWidth
                            variant="outlined"
                            value={form.title}
                            onChange={handleFormChange}
                            helperText="Введите название ресурса (обязательно)."
                            sx={{ marginBottom: 2 }}
                            required
                        />
                        <TextField
                            label="Описание"
                            name="description"
                            fullWidth
                            variant="outlined"
                            value={form.description}
                            onChange={handleFormChange}
                            helperText="Краткое описание ресурса."
                            sx={{ marginBottom: 2 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <input
                                accept="*"
                                style={{ display: 'none' }}
                                id="file-upload"
                                type="file"
                                name="file"
                                onChange={handleFormChange}
                            />
                            <label htmlFor="file-upload">
                                <StyledButton variant="contained" component="span" startIcon={<UploadIcon />}>
                                    {form.file ? form.file.name : 'Загрузить файл'}
                                </StyledButton>
                            </label>
                            {form.file && (
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    {form.file.name}
                                </Typography>
                            )}
                        </Box>
                        <StyledButton type="submit" sx={{ ml: 2 }}>
                            Добавить ресурс
                        </StyledButton>
                    </Box>
                )}

                {/* Блок Фильтров */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        Фильтры
                    </Typography>
                    <TextField
                        label="Поиск по названию"
                        name="title"
                        fullWidth
                        variant="outlined"
                        value={filters.title}
                        onChange={handleFilterChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        helperText="Введите ключевые слова для поиска по названию."
                        sx={{ marginBottom: 2 }}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Дата начала"
                                name="startDate"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                helperText="Выберите дату начала поиска."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Дата окончания"
                                name="endDate"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                helperText="Выберите дату окончания поиска."
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Список Ресурсов */}
                <AnimatePresence>
                    {status === 'loading' ? (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        filterResources().map((resource) => (
                            <MotionCard
                                key={resource.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CardContent>
                                    <Typography variant="h5">{resource.title}</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        {resource.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Автор: {getAuthorNameById(resource.userId)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        Дата создания: {new Date(resource.createdAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        color="primary"
                                        startIcon={<GetAppIcon />}
                                        onClick={() => handleDownload(resource.id, resource.title)}
                                    >
                                        Скачать
                                    </Button>
                                    {isAuth && (
                                        <IconButton edge="end" color="secondary" onClick={() => handleDelete(resource.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </CardActions>
                            </MotionCard>
                        ))
                    )}
                </AnimatePresence>
            </StyledContainer>
        </PageWrapper>
    );

};

export default Resources;
