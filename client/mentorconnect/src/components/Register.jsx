import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister } from '../redux/slices/userSlice';
import { fetchFaculties } from '../redux/slices/facultySlice';
import { fetchSpecializations } from '../redux/slices/specializationSlice';
import {
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Link,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Импортируем framer-motion
import registerIllustration from '../assets/registerIllustration.png'; // Добавьте вашу иллюстрацию
import decorative1 from '../assets/decorative1.png'; // Дополнительная декоративная иллюстрация
import decorative2 from '../assets/decorative2.png'; // Дополнительная декоративная иллюстрация

// Styled Components

const RegisterWrapper = styled(Box)(({ theme }) => ({
    background: `url('/path/to/your/background.jpg') no-repeat center center fixed`, // Замените на путь к вашему изображению
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
}));

const DecorativeImage = styled('img')(({ theme }) => ({
    position: 'absolute',
    width: '400px',
    opacity: 0.2, // Уменьшенная непрозрачность для декоративных элементов
    [theme.breakpoints.down('sm')]: {
        width: '150px',
    },
}));

const FormContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: theme.spacing(8, 6),
    borderRadius: theme.spacing(3),
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(6),
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        textAlign: 'center',
        padding: theme.spacing(6, 4),
    },
}));

const FormSection = styled(Box)(({ theme }) => ({
    flex: 1,
}));

const IllustrationSection = styled(Box)(({ theme }) => ({
    flex: 1,
    textAlign: 'center',
    '& img': {
        width: '130%',
        height: 'auto',
    },
    [theme.breakpoints.down('md')]: {
        marginTop: theme.spacing(4),
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

const MotionBox = motion(Box); // Создаем анимируемый Box

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'mentee',
        course: '',
        recordBookNumber: '',
        facultyId: '',
        specializationId: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [visibleFields, setVisibleFields] = useState({
        firstName: true, // Первое поле всегда видно
        lastName: false,
        email: false,
        password: false,
        course: false,
        recordBookNumber: false,
        facultyId: false,
        specializationId: false,
    });

    const faculties = useSelector((state) => state.faculties.faculties);
    const specializations = useSelector((state) => state.specializations.specializations);

    useEffect(() => {
        dispatch(fetchFaculties());
        dispatch(fetchSpecializations());
    }, [dispatch]);

    useEffect(() => {
        // Проверяем, какие поля заполнены и делаем видимыми следующие
        if (form.firstName && !visibleFields.lastName) {
            setVisibleFields((prev) => ({ ...prev, lastName: true }));
        }
        if (form.lastName && !visibleFields.email) {
            setVisibleFields((prev) => ({ ...prev, email: true }));
        }
        if (form.email && !visibleFields.password) {
            setVisibleFields((prev) => ({ ...prev, password: true }));
        }
        if (form.password && !visibleFields.course) {
            setVisibleFields((prev) => ({ ...prev, course: true }));
        }
        if (form.course && !visibleFields.recordBookNumber) {
            setVisibleFields((prev) => ({ ...prev, recordBookNumber: true }));
        }
        if (form.recordBookNumber && !visibleFields.facultyId) {
            setVisibleFields((prev) => ({ ...prev, facultyId: true }));
        }
        if (form.facultyId && !visibleFields.specializationId) {
            setVisibleFields((prev) => ({ ...prev, specializationId: true }));
        }
    }, [form, visibleFields]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = 'Имя обязательно';
        if (!form.lastName) newErrors.lastName = 'Фамилия обязательна';
        if (!form.email) newErrors.email = 'Электронная почта обязательна';
        if (!form.password) newErrors.password = 'Пароль обязателен';
        if (!form.facultyId) newErrors.facultyId = 'Факультет обязателен';
        if (!form.specializationId) newErrors.specializationId = 'Специализация обязательна';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const resultAction = await dispatch(fetchRegister(form)).unwrap();
            setMessage('Регистрация прошла успешно');
            localStorage.setItem('token', resultAction.token); // Сохранение токена в localStorage
            navigate('/'); // Redirect to home after successful registration
        } catch (err) {
            setMessage('Ошибка регистрации: ' + err.message);
        }
    };

    // Определяем анимационные варианты
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <RegisterWrapper>
            {/* Дополнительные декоративные изображения */}
            <DecorativeImage src={decorative1} alt="Декоративное изображение 1" style={{ top: '10%', left: '5%' }} />
            <DecorativeImage src={decorative2} alt="Декоративное изображение 2" style={{ bottom: '15%', right: '10%' }} />

            <FormContainer>
                <FormSection>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: '700', color: '#333', fontSize: '2.5rem' }}>
                        Регистрация
                    </Typography>
                    {message && <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>{message}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        {/* Поле Имя */}
                        <MotionBox
                            initial="hidden"
                            animate={visibleFields.firstName ? 'visible' : 'hidden'}
                            variants={variants}
                            transition={{ duration: 0.5 }}
                        >
                            <TextField
                                margin="normal"
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
                        </MotionBox>

                        {/* Поле Фамилия */}
                        {visibleFields.lastName && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.lastName ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    margin="normal"
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
                            </MotionBox>
                        )}

                        {/* Поле Электронная почта */}
                        {visibleFields.email && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.email ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    margin="normal"
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
                            </MotionBox>
                        )}

                        {/* Поле Пароль */}
                        {visibleFields.password && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.password ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    margin="normal"
                                    required
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
                            </MotionBox>
                        )}

                        {/* Поле Курс */}
                        {visibleFields.course && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.course ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="course"
                                    label="Курс"
                                    name="course"
                                    autoComplete="course"
                                    value={form.course}
                                    onChange={handleChange}
                                    placeholder="Введите ваш курс"
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
                            </MotionBox>
                        )}

                        {/* Поле Номер зачетной книжки */}
                        {visibleFields.recordBookNumber && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.recordBookNumber ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="recordBookNumber"
                                    label="Номер зачетной книжки"
                                    name="recordBookNumber"
                                    autoComplete="recordBookNumber"
                                    value={form.recordBookNumber}
                                    onChange={handleChange}
                                    placeholder="Введите номер вашей зачетной книжки"
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
                            </MotionBox>
                        )}

                        {/* Поле Факультет */}
                        {visibleFields.facultyId && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.facultyId ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <FormControl fullWidth margin="normal" required error={Boolean(errors.facultyId)}>
                                    <InputLabel id="facultyId-label">Факультет</InputLabel>
                                    <Select
                                        labelId="facultyId-label"
                                        id="facultyId"
                                        name="facultyId"
                                        value={form.facultyId}
                                        onChange={handleChange}
                                        label="Факультет"
                                        sx={{
                                            '& .MuiSelect-select': {
                                                height: '60px',
                                                fontSize: '1.1rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1.1rem',
                                            },
                                        }}
                                    >
                                        {faculties.map((faculty) => (
                                            <MenuItem key={faculty.id} value={faculty.id}>
                                                {faculty.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.facultyId && <Typography color="error">{errors.facultyId}</Typography>}
                                </FormControl>
                            </MotionBox>
                        )}

                        {/* Поле Специализация */}
                        {visibleFields.specializationId && (
                            <MotionBox
                                initial="hidden"
                                animate={visibleFields.specializationId ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}
                            >
                                <FormControl fullWidth margin="normal" required error={Boolean(errors.specializationId)}>
                                    <InputLabel id="specializationId-label">Специализация</InputLabel>
                                    <Select
                                        labelId="specializationId-label"
                                        id="specializationId"
                                        name="specializationId"
                                        value={form.specializationId}
                                        onChange={handleChange}
                                        label="Специализация"
                                        sx={{
                                            '& .MuiSelect-select': {
                                                height: '60px',
                                                fontSize: '1.1rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1.1rem',
                                            },
                                        }}
                                    >
                                        {specializations.map((specialization) => (
                                            <MenuItem key={specialization.id} value={specialization.id}>
                                                {specialization.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.specializationId && <Typography color="error">{errors.specializationId}</Typography>}
                                </FormControl>
                            </MotionBox>
                        )}

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Зарегистрироваться
                        </StyledButton>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 4, color: '#555' }}>
                        Уже есть аккаунт?{' '}
                        <Link href="/login" underline="none" sx={{ color: '#ff4081', fontWeight: '600' }}>
                            Войти
                        </Link>
                    </Typography>
                </FormSection>
                <IllustrationSection>
                    <img src={registerIllustration} alt="Иллюстрация регистрации" />
                </IllustrationSection>
            </FormContainer>
        </RegisterWrapper>
    );
};

export default Register;