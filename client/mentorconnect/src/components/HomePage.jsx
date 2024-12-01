import React from 'react';
import { Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom'; // Импортируем Link для навигации
import mentorIllustration from '../assets/HomePageStudent.png'; // Убедитесь, что путь правильный
import purposeIllustration from '../assets/purposeIllustration.png'; // Добавьте новое изображение

// Импорт иконок из Material-UI
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import FlagIcon from '@mui/icons-material/Flag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Styled Components
const HomePageWrapper = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Более яркий градиент
    minHeight: '100vh',
    padding: theme.spacing(4, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

const PurposeContentBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(6),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        textAlign: 'center',
    },
}));

const PurposeTextSection = styled(Box)(({ theme }) => ({
    width: '100%',
}));

const PurposeIllustrationSection = styled(Box)(({ theme }) => ({
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
    textDecoration: 'none', // Убираем подчеркивание
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

// Компонент AdvantageCard для отображения преимуществ
const AdvantageCard = ({ icon: Icon, title, description }) => (
    <Card
        sx={{
            maxWidth: 345,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s, boxShadow 0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            },
        }}
    >
        <CardContent sx={{ textAlign: 'center' }}>
            <Icon sx={{ fontSize: 50, color: '#ff4081' }} />
            <Typography variant="h6" component="div" gutterBottom sx={{ marginTop: 2 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

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
                    <StyledButton variant="contained" component={Link} to="/register">
                        Начать Сейчас
                    </StyledButton>
                </TextSection>
                <IllustrationSection>
                    <img src={mentorIllustration} alt="Менторская иллюстрация" />
                </IllustrationSection>
            </ContentBox>

            {/* Новая Секция: О нашей платформе */}
            <PurposeContentBox>
                <PurposeTextSection>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: '700', color: '#333' }}>
                        О нашей платформе
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ color: '#555', lineHeight: 1.6 }}>
                        Наша платформа создана для того, чтобы соединить менторов и ментии (mentees), обеспечивая взаимовыгодное сотрудничество и развитие.
                    </Typography>
                    
                    {/* Преимущества для Ментии */}
                    <Typography variant="h5" gutterBottom sx={{ marginTop: 4, color: '#333' }}>
                        Преимущества для Ментии:
                    </Typography>
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={AccessTimeIcon}
                                title="Доступ к опыту"
                                description="Получите ценные знания и навыки от опытных менторов."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={PeopleIcon}
                                title="Расширение сети контактов"
                                description="Заводите полезные знакомства и расширяйте свой профессиональный круг."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={FlagIcon}
                                title="Целеполагание и поддержка"
                                description="Устанавливайте цели и получайте поддержку в их достижении."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={TrendingUpIcon}
                                title="Профессиональный рост"
                                description="Развивайтесь и достигаете новых высот в своей карьере."
                            />
                        </Grid>
                    </Grid>

                    {/* Преимущества для Менторов */}
                    <Typography variant="h5" gutterBottom sx={{ marginTop: 4, color: '#333' }}>
                        Преимущества для Менторов:
                    </Typography>
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={StarIcon}
                                title="Вклад в развитие других"
                                description="Помогайте другим достигать своих целей и развиваться."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={SchoolIcon}
                                title="Саморазвитие"
                                description="Улучшайте свои навыки коммуникации и лидерства."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={ConnectWithoutContactIcon}
                                title="Расширение сети контактов"
                                description="Заводите новые профессиональные связи и партнерства."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <AdvantageCard
                                icon={EmojiEventsIcon}
                                title="Профессиональное признание"
                                description="Повышайте свой статус и узнаваемость в профессиональном сообществе."
                            />
                        </Grid>
                    </Grid>
                </PurposeTextSection>
                <PurposeIllustrationSection>
                    <img src={purposeIllustration} alt="Иллюстрация целей платформы" />
                </PurposeIllustrationSection>
            </PurposeContentBox>
            
            {/* Кнопка начать сейчас */}
            <StyledButton variant="contained" component={Link} to="/register">
                Начать Сейчас
            </StyledButton>

            {/* Нижний Колонтитул */}
            <Box sx={{ marginTop: 8, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                    © {new Date().getFullYear()} morganizwd. Все права защищены.
                </Typography>
            </Box>
        </HomePageWrapper>
    );

};

export default HomePage;
