import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, updateUser } from '../redux/slices/userSlice';
import { fetchTagsByUserId, createTag, deleteTag } from '../redux/slices/tagSlice';
import { fetchContactsByUserId, createContact, deleteContact } from '../redux/slices/contactSlice';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Stack,
    Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';

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
        course: '',
        recordBookNumber: '',
        facultyId: '',
        specializationId: '',
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

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                course: user.course || '',
                recordBookNumber: user.recordBookNumber || '',
                facultyId: user.facultyId || '',
                specializationId: user.specializationId || '',
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
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
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
        const validation = validateForm();
        if (!validation) return;

        const formData = new FormData();
        for (const key in form) {
            if (form[key]) {
                formData.append(key, form[key]);
            }
        }

        try {
            const resultAction = await dispatch(updateUser({ id: user.id, formData })).unwrap();
            setMessage('Профиль успешно обновлен');
            // Обновление аватара после успешного обновления профиля
            if (form.avatar) {
                setAvatarPreview(`${apiUrl}${resultAction.avatar}`);
            }
        } catch (err) {
            setMessage('Ошибка обновления профиля: ' + err.message);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'Имя обязательно';
        if (!form.lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
        if (!form.email.trim()) newErrors.email = 'Электронная почта обязательна';
        if (!form.facultyId) newErrors.facultyId = 'Факультет обязателен';
        if (!form.specializationId) newErrors.specializationId = 'Специализация обязательна';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTag = () => {
        if (newTag.trim()) {
            dispatch(createTag({ name: newTag, userId: user.id }));
            setNewTag('');
        }
    };

    const handleDeleteTag = (id) => {
        dispatch(deleteTag(id));
    };

    const handleAddContact = () => {
        if (newContact.vk || newContact.telegram || newContact.phoneNumber) {
            dispatch(createContact({ ...newContact, userId: user.id }));
            setNewContact({
                vk: '',
                telegram: '',
                phoneNumber: '',
            });
        }
    };

    const handleDeleteContact = (id) => {
        dispatch(deleteContact(id));
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
                                <AnimatePresence>
                                    {message && (
                                        <MotionAlert
                                            severity="info"
                                            sx={{ mb: 4 }}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={alertVariants}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {message}
                                        </MotionAlert>
                                    )}
                                </AnimatePresence>
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {/* Анимированный Avatar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <MotionAvatar
                                            src={avatarPreview}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            sx={{ width: 300, height: 300, mr: 2 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
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
                                    </Box>

                                    <Stack spacing={2}>
                                        {/* Поля формы с анимацией */}
                                        <AnimatePresence>
                                            <MotionTextField
                                                key="firstName"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label="Имя"
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
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            <MotionTextField
                                                key="lastName"
                                                required
                                                fullWidth
                                                id="lastName"
                                                label="Фамилия"
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
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            <MotionTextField
                                                key="email"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Электронная почта"
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
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            <MotionTextField
                                                key="password"
                                                fullWidth
                                                name="password"
                                                label="Пароль"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                                value={form.password}
                                                onChange={handleChange}
                                                error={Boolean(errors.password)}
                                                helperText={errors.password}
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
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            <MotionTextField
                                                key="course"
                                                fullWidth
                                                id="course"
                                                label="Курс"
                                                name="course"
                                                autoComplete="course"
                                                value={form.course}
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
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            <MotionTextField
                                                key="recordBookNumber"
                                                fullWidth
                                                id="recordBookNumber"
                                                label="Номер зачетной книжки"
                                                name="recordBookNumber"
                                                autoComplete="recordBookNumber"
                                                value={form.recordBookNumber}
                                                onChange={handleChange}
                                                placeholder="Введите номер вашей зачетной книжки"
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
                                        </AnimatePresence>
                                        <StyledButton
                                            type="submit"
                                            variant="contained"
                                            component={motion.button}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Обновить профиль
                                        </StyledButton>
                                    </Stack>
                                </Box>
                            </Box>
                        </FormContainer>
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
                                    <Button
                                        variant="contained"
                                        onClick={handleAddTag}
                                        sx={{ height: '56px' }}
                                        component={motion.button}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Добавить
                                    </Button>
                                </Box>
                                <List>
                                    <AnimatePresence>
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
                                    </AnimatePresence>
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
                                    <Button
                                        variant="contained"
                                        onClick={handleAddContact}
                                        sx={{ height: '56px', flex: '1 1 200px', mb: 2 }}
                                        component={motion.button}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Добавить
                                    </Button>
                                </Box>
                                <List>
                                    <AnimatePresence>
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
                                    </AnimatePresence>
                                </List>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ProfileWrapper>
    );

};

export default UserProfile;
