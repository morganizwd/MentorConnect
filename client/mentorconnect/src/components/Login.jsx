// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuth } from '../redux/slices/userSlice';
import { TextField, Button, Typography, Alert, Box, Link, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../assets/loginIllustration.png'; // Добавьте вашу иллюстрацию
import decorative1 from '../assets/decorative1.png'; // Дополнительная декоративная иллюстрация
import decorative2 from '../assets/decorative2.png'; // Дополнительная декоративная иллюстрация
import { loginSchema } from '../validation/loginValidation'; // Импортируем схему валидации

// Styled Components

const LoginWrapper = styled(Box)(({ theme }) => ({
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
  width: '550px',
  opacity: 0.9,
  [theme.breakpoints.down('sm')]: {
    width: '100px',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  padding: theme.spacing(8, 6),
  borderRadius: theme.spacing(3),
  maxWidth: '700px',
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
    width: '100%',
    maxWidth: '350px',
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', severity: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние загрузки

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Очистка ошибки для поля при изменении
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
    // Очистка общего сообщения
    setMessage({ text: '', severity: 'info' });
  };

  const validateForm = () => {
    const { error } = loginSchema.validate(form, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }
    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true); // Начало отправки

    try {
      const resultAction = await dispatch(fetchAuth(form)).unwrap();
      setMessage({ text: 'Вход выполнен успешно', severity: 'success' });
      localStorage.setItem('token', resultAction.token); // Сохранение токена в localStorage
      navigate('/'); // Перенаправление на главную страницу после успешного входа
    } catch (err) {
      // Обработка ошибок от сервера
      if (err.response && err.response.data && err.response.data.message) {
        setMessage({ text: `Ошибка входа: ${err.response.data.message}`, severity: 'error' });
      } else {
        setMessage({ text: `Ошибка входа: ${err.message}`, severity: 'error' });
      }
    } finally {
      setIsSubmitting(false); // Завершение отправки
    }
  };

  // Автоматическое скрытие сообщений через 5 секунд
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', severity: 'info' });
      }, 5000); // Скрыть через 5 секунд
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <LoginWrapper>
      {/* Дополнительные декоративные изображения */}
      <DecorativeImage src={decorative1} alt="Декоративное изображение 1" style={{ top: '10%', left: '5%' }} />
      <DecorativeImage src={decorative2} alt="Декоративное изображение 2" style={{ bottom: '15%', right: '10%' }} />

      <FormContainer>
        <FormSection>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: '700', color: '#333', fontSize: '2rem' }}>
            Вход
          </Typography>
          {message.text && <Alert severity={message.severity} sx={{ mb: 4, fontSize: '1rem' }}>{message.text}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Электронная почта"
              name="email"
              autoComplete="email"
              autoFocus
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
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </StyledButton>
          </Box>
          <Typography variant="body1" sx={{ mt: 4, color: '#555' }}>
            Нет аккаунта?{' '}
            <Link href="/register" underline="none" sx={{ color: '#ff4081', fontWeight: '600' }}>
              Зарегистрироваться
            </Link>
          </Typography>
        </FormSection>
        <IllustrationSection>
          <img src={loginIllustration} alt="Иллюстрация входа" />
        </IllustrationSection>
      </FormContainer>
    </LoginWrapper>
  );

};

export default Login;
