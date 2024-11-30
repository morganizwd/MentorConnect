import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, updateUser, deleteAvatar } from '../redux/slices/userSlice';
import { fetchTagsByUserId, createTag, deleteTag } from '../redux/slices/tagSlice';
import { fetchContactsByUserId, createContact, deleteContact } from '../redux/slices/contactSlice';
import { fetchFaculties } from '../redux/slices/facultySlice'; // Импортируйте fetchFaculties
import { fetchSpecializations } from '../redux/slices/specializationSlice'; // Импортируйте fetchSpecializations
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Alert,
    Snackbar,
    Grid,
    Stack,
    Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Импортируем изображения
import decorative1 from '../assets/main_png.png';
import decorative2 from '../assets/decorative2.png';
import profileIllustration from '../assets/profile.png'; // Предположим, что это иллюстрация профиля

const apiUrl = 'http://localhost:7000'; // Переместил сюда для удобства

// Styled Components

const ProfileWrapper = styled(Box)(({ theme }) => ({
    background: `url('/assets/background.jpg') no-repeat center center fixed`, // Замените на путь к вашему изображению
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
}));

const DecorativeImage = styled('img')(({ theme }) => ({
    position: 'absolute',
    width: '350px',
    opacity: 0.8,
    [theme.breakpoints.down('sm')]: {
        width: '100px',
    },
}));

const FormContainer = styled(motion(Box))(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(3),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(6),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: theme.spacing(4),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(1.5, 5),
    backgroundColor: '#ff4081',
    color: '#fff',
    fontWeight: '600',
    borderRadius: theme.spacing(2),
    boxShadow: '0 6px 18px rgba(255, 64, 129, 0.4)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    fontSize: '1.1rem',
    '&:hover': {
        backgroundColor: '#e91e63',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
    },
}));

const MotionAvatar = motion(Avatar); // Анимируемый Avatar
const MotionTextField = motion(TextField); // Анимируемые TextField
const MotionListItem = motion(ListItem); // Анимируемые ListItem
const MotionAlert = motion(Alert); // Анимируемый Alert
const MotionButton = motion(Button); // Анимированный Button

const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.data);
    const tags = useSelector((state) => state.tags.tags);
    const contacts = useSelector((state) => state.contacts.contacts);
    const faculties = useSelector((state) => state.faculties.faculties);
    const specializations = useSelector((state) => state.specializations.specializations);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        course: null, // Инициализация как null
        recordBookNumber: null, // Инициализация как null
        facultyId: null,
        specializationId: null,
        avatar: null,
        role: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [newTag, setNewTag] = useState('');
    const [newContact, setNewContact] = useState({
        vk: '',
        telegram: '',
        phoneNumber: '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false); // Состояние для Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'

    useEffect(() => {
        dispatch(fetchAuthMe());
        dispatch(fetchFaculties()); // Добавьте загрузку факультетов
        dispatch(fetchSpecializations()); // Добавьте загрузку специализаций
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            console.log('User loaded:', user); // Отладка
            setForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                course: user.course ?? null, // Устанавливаем null вместо ''
                recordBookNumber: user.recordBookNumber ?? null,
                facultyId: user.facultyId ?? null,
                specializationId: user.specializationId ?? null,
                avatar: null,
                role: user.role || '',
            });
            setAvatarPreview(user.avatar ? `${apiUrl}${user.avatar}` : null);
            dispatch(fetchTagsByUserId(user.id));
            dispatch(fetchContactsByUserId(user.id));
        }
    }, [user, dispatch]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setForm((prev) => ({
                ...prev,
                [name]: file,
            }));
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            if (name === 'course') {
                setForm((prev) => ({
                    ...prev,
                    course: value ? Number(value) : null, // Преобразуем в число или null
                }));
            } else {
                setForm((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setNewContact((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit called'); // Отладка
        const validation = validateForm();
        if (!validation) {
            console.log('Validation failed:', errors); // Отладка
            return;
        }

        const formData = new FormData();
        for (const key in form) {
            if (key === 'recordBookNumber') continue; // Пропускаем recordBookNumber
            if (key === 'course') {
                if (form.course !== null && form.course !== undefined) {
                    formData.append(key, form.course); // Добавляем только если не null
                }
                continue;
            }
            if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        }

        try {
            const resultAction = await dispatch(updateUser({ id: user.id, formData })).unwrap();
            console.log('Update successful:', resultAction); // Отладка
            setMessage('Профиль успешно обновлен');
            setSnackbarMessage('Профиль успешно обновлен');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            // Обновление аватара после успешного обновления профиля
            if (form.avatar) {
                setAvatarPreview(`${apiUrl}${resultAction.avatar}`);
            }
        } catch (err) {
            setMessage('Ошибка обновления профиля: ' + err.message);
            console.error('Update User Error:', err); // Отладка
            setSnackbarMessage('Ошибка обновления профиля');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'Имя обязательно';
        if (!form.lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
        if (!form.email.trim()) newErrors.email = 'Электронная почта обязательна';
        if (!form.password.trim()) newErrors.password = 'Пароль обязателен для применения изменений'; // Новая проверка
        // Убираем обязательность facultyId и specializationId
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTag = () => {
        if (newTag.trim()) {
            dispatch(createTag({ name: newTag, userId: user.id }))
                .then(() => {
                    setSnackbarMessage('Тег добавлен');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                })
                .catch((err) => {
                    setSnackbarMessage('Ошибка добавления тега');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                });
            setNewTag('');
        }
    };

    const handleDeleteTag = (id) => {
        dispatch(deleteTag(id))
            .then(() => {
                setSnackbarMessage('Тег удален');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            })
            .catch((err) => {
                setSnackbarMessage('Ошибка удаления тега');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleAddContact = () => {
        if (newContact.vk || newContact.telegram || newContact.phoneNumber) {
            dispatch(createContact({ ...newContact, userId: user.id }))
                .then(() => {
                    setSnackbarMessage('Контакт добавлен');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                })
                .catch((err) => {
                    setSnackbarMessage('Ошибка добавления контакта');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                });
            setNewContact({
                vk: '',
                telegram: '',
                phoneNumber: '',
            });
        }
    };

    const handleDeleteContact = (id) => {
        dispatch(deleteContact(id))
            .then(() => {
                setSnackbarMessage('Контакт удален');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            })
            .catch((err) => {
                setSnackbarMessage('Ошибка удаления контакта');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            });
    };

    const handleDeleteAvatar = async () => {
        try {
            await dispatch(deleteAvatar(user.id)).unwrap();
            setMessage('Аватар успешно удален');
            setSnackbarMessage('Аватар успешно удален');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            // Автоматически обновится через useEffect
        } catch (err) {
            setMessage('Ошибка удаления аватарки: ' + err);
            console.error('Delete Avatar Error:', err); // Отладка
            setSnackbarMessage('Ошибка удаления аватарки');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (!user) {
        return (
            <Container>
                <Typography variant="h6">Загрузка...</Typography>
            </Container>
        );
    }

    const userTags = tags.filter(tag => tag.userId === user.id);
    const userContacts = contacts.filter(contact => contact.userId === user.id);

    // Анимационные варианты
    const formVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
    };

    const alertVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    // Получаем названия факультета и специализации для отображения
    const getFacultyName = () => {
        if (form.facultyId === null) return 'Не выбрано';
        const faculty = faculties.find(fac => fac.id === form.facultyId);
        return faculty ? faculty.name : 'Неизвестно';
    };

    const getSpecializationName = () => {
        if (form.specializationId === null) return 'Не выбрано';
        const specialization = specializations.find(spec => spec.id === form.specializationId);
        return specialization ? specialization.name : 'Неизвестно';
    };

    return (
        <ProfileWrapper>
            {/* Дополнительные декоративные изображения */}
            <DecorativeImage src={decorative1} alt="Декоративное изображение 1" style={{ top: '10%', left: '5%' }} />
            <DecorativeImage src={decorative2} alt="Декоративное изображение 2" style={{ bottom: '15%', right: '10%' }} />

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Форма профиля и иллюстрация */}
                    <Grid item xs={12} md={6}>
                        <FormContainer
                            initial="hidden"
                            animate="visible"
                            variants={formVariants}
                            transition={{ duration: 0.5 }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', color: '#333' }}>
                                    Профиль пользователя
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {/* Анимированный Avatar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <MotionAvatar
                                            src={avatarPreview}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            sx={{ width: 150, height: 150, mr: 2 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <Box>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="avatar"
                                                type="file"
                                                name="avatar"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="avatar">
                                                <IconButton component="span" aria-label="изменить аватар">
                                                    <EditIcon />
                                                </IconButton>
                                            </label>
                                            {avatarPreview && (
                                                <IconButton
                                                    aria-label="удалить аватар"
                                                    onClick={handleDeleteAvatar}
                                                    color="error"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>

                                    <Stack spacing={2}>
                                        {/* Поля формы */}
                                        <MotionTextField
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="Имя *" // Добавлен символ * для обязательности
                                            name="firstName"
                                            autoComplete="fname"
                                            autoFocus
                                            value={form.firstName}
                                            onChange={handleChange}
                                            error={Boolean(errors.firstName)}
                                            helperText={errors.firstName}
                                            placeholder="Введите ваше имя"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        <MotionTextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Фамилия *" // Добавлен символ * для обязательности
                                            name="lastName"
                                            autoComplete="lname"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            error={Boolean(errors.lastName)}
                                            helperText={errors.lastName}
                                            placeholder="Введите вашу фамилию"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        <MotionTextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Электронная почта *" // Добавлен символ * для обязательности
                                            name="email"
                                            autoComplete="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            error={Boolean(errors.email)}
                                            helperText={errors.email}
                                            placeholder="Введите вашу электронную почту"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        <MotionTextField
                                            required // Делает поле обязательным
                                            fullWidth
                                            name="password"
                                            label="Пароль *" // Добавлен символ * для обязательности
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            value={form.password}
                                            onChange={handleChange}
                                            error={Boolean(errors.password)}
                                            helperText={errors.password || 'Введите пароль для применения изменений'} // Обновленный helperText
                                            placeholder="Введите ваш пароль"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        <MotionTextField
                                            fullWidth
                                            id="course"
                                            label="Курс"
                                            name="course"
                                            type="number" // Изменено на "number"
                                            autoComplete="course"
                                            value={form.course !== null ? form.course : ''}
                                            onChange={handleChange}
                                            placeholder="Введите ваш курс"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        <MotionTextField
                                            fullWidth
                                            id="recordBookNumber"
                                            label="Номер зачетной книжки"
                                            name="recordBookNumber"
                                            autoComplete="recordBookNumber"
                                            value={user.recordBookNumber || 'Не указано'}
                                            onChange={() => { }} // Не даём изменять поле
                                            placeholder="Введите номер вашей зачетной книжки"
                                            variants={formVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            transition={{ duration: 0.5 }}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '60px',
                                                    fontSize: '1.1rem',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '1.1rem',
                                                },
                                            }}
                                        />

                                        {/* Отображение факультета */}
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                                                Факультет:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getFacultyName()}
                                            </Typography>
                                        </Box>

                                        {/* Отображение специализации */}
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>
                                                Специализация:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getSpecializationName()}
                                            </Typography>
                                        </Box>

                                        <MotionButton
                                            type="submit"
                                            variant="contained"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            sx={{
                                                marginTop: 4,
                                                padding: '12px 40px',
                                                backgroundColor: '#ff4081',
                                                color: '#fff',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                boxShadow: '0 6px 18px rgba(255, 64, 129, 0.4)',
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    backgroundColor: '#e91e63',
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
                                                },
                                            }}
                                        >
                                            Обновить профиль
                                        </MotionButton>
                                    </Stack>
                                </Box> {/* Закрытие Box для формы */}
                            </Box> {/* Закрытие Box с шириной */}
                        </FormContainer> {/* Закрытие FormContainer */}
                    </Grid>

                    {/* Иллюстрация профиля */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box>
                            <img src={profileIllustration} alt="Иллюстрация профиля" />
                        </Box>
                    </Grid>
                </Grid>

                {/* Секции Tags и Contacts */}
                <Grid container spacing={4} sx={{ mt: 6 }}>
                    {/* Секция Tags */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 4 }}>
                            <Stack spacing={3}>
                                <Typography variant="h5" gutterBottom>
                                    Теги
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        label="Новый тег"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        sx={{ mr: 2, flex: 1 }}
                                        variant="outlined"
                                        size="large"
                                    />
                                    <MotionButton
                                        variant="contained"
                                        onClick={handleAddTag}
                                        sx={{ height: '56px' }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Добавить
                                    </MotionButton>
                                </Box>
                                <List>
                                    {userTags.map((tag) => (
                                        <MotionListItem
                                            key={tag.id}
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            variants={{
                                                hidden: { opacity: 0, x: -50 },
                                                visible: { opacity: 1, x: 0 },
                                                exit: { opacity: 0, x: 50 },
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ListItemText primary={tag.name} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(tag.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </MotionListItem>
                                    ))}
                                </List>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Секция Contacts */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 4 }}>
                            <Stack spacing={3}>
                                <Typography variant="h5" gutterBottom>
                                    Контакты
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <TextField
                                        label="VK"
                                        name="vk"
                                        value={newContact.vk}
                                        onChange={handleContactChange}
                                        sx={{ mr: 2, flex: '1 1 200px', mb: 2 }}
                                        variant="outlined"
                                        size="large"
                                    />
                                    <TextField
                                        label="Telegram"
                                        name="telegram"
                                        value={newContact.telegram}
                                        onChange={handleContactChange}
                                        sx={{ mr: 2, flex: '1 1 200px', mb: 2 }}
                                        variant="outlined"
                                        size="large"
                                    />
                                    <TextField
                                        label="Номер телефона"
                                        name="phoneNumber"
                                        value={newContact.phoneNumber}
                                        onChange={handleContactChange}
                                        sx={{ mr: 2, flex: '1 1 200px', mb: 2 }}
                                        variant="outlined"
                                        size="large"
                                    />
                                    <MotionButton
                                        variant="contained"
                                        onClick={handleAddContact}
                                        sx={{ height: '56px', flex: '1 1 200px', mb: 2 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Добавить
                                    </MotionButton>
                                </Box>
                                <List>
                                    {userContacts.map((contact) => (
                                        <MotionListItem
                                            key={contact.id}
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            variants={{
                                                hidden: { opacity: 0, x: -50 },
                                                visible: { opacity: 1, x: 0 },
                                                exit: { opacity: 0, x: 50 },
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <>
                                                        {contact.vk && <Typography>VK: {contact.vk}</Typography>}
                                                        {contact.telegram && <Typography>Telegram: {contact.telegram}</Typography>}
                                                        {contact.phoneNumber && <Typography>Телефон: {contact.phoneNumber}</Typography>}
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteContact(contact.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </MotionListItem>
                                    ))}
                                </List>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

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
        </ProfileWrapper>
    );
};

export default UserProfile;
