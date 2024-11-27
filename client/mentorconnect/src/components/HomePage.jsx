import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';
import mentorIllustration from '../assets/HomePageStudent.png'; // Убедитесь, что путь правильный

// Styled Components
const HomePageWrapper = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Более яркий градиент
    minHeight: '100vh',
    padding: theme.spacing(4, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(6),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        textAlign: 'center',
    },
}));

const TextSection = styled(Box)(({ theme }) => ({
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
    '&:hover': {
        backgroundColor: '#e91e63',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
    },
}));

const HighlightText = styled('span')(({ theme }) => ({
    color: '#ff4081',
    fontWeight: 'bold',
}));

const HomePage = () => {
    return (
        <HomePageWrapper>
            <ContentBox>
                <TextSection>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: '700', color: '#333' }}>
                        Станьте Ментором Сегодня
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ color: '#555', lineHeight: 1.6 }}>
                        Вы увлечены делением знаниями и хотите помочь другим расти? Присоединяйтесь к нашему сообществу менторов и внесите значимый вклад!
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ marginTop: 4, color: '#333' }}>
                        Как начать:
                    </Typography>
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body1" gutterBottom sx={{ color: '#555', lineHeight: 1.6 }}>
                            <strong>1. Свяжитесь с нами:</strong> Напишите нашему администратору, чтобы выразить заинтересованность в роли ментора. Используйте следующие контакты:
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ color: '#555', marginLeft: 2 }}>
                            📞 Телефон: +375336146223
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ color: '#555', marginLeft: 2 }}>
                            📧 Email: <a href="mailto:morganizwd@gmail.com" style={{ color: '#ff4081', textDecoration: 'none' }}>morganizwd@gmail.com</a>
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#555', marginTop: 2, lineHeight: 1.6 }}>
                            <strong>2. Собеседование:</strong> Запланируйте собеседование с нашим администратором для подтверждения вашей личности и обсуждения квалификаций.
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ color: '#555', lineHeight: 1.6 }}>
                            <strong>3. Станьте Ментором:</strong> После успешной верификации ваша роль будет обновлена до ментора.
                        </Typography>
                    </Box>
                    <StyledButton variant="contained">
                        Начать Сейчас
                    </StyledButton>
                </TextSection>
                <IllustrationSection>
                    <img src={mentorIllustration} alt="Менторская иллюстрация" />
                </IllustrationSection>
            </ContentBox>
            <Box sx={{ marginTop: 8, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                    © {new Date().getFullYear()} morganizwd. Все права защищены.
                </Typography>
            </Box>
        </HomePageWrapper>
    );
};

export default HomePage;
