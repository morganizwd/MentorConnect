import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const HomePage = () => {
    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
                <Typography variant="h4" gutterBottom>
                    How to Become a Mentor
                </Typography>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        If you are newly registered and would like to become a mentor, please follow the instructions below:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        1. Contact the admin to express your interest in becoming a mentor. You can reach out via the following contact details:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Phone: +375336146223
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Email: <a href="mailto:morganizwd@gmail.com">morganizwd@gmail.com</a>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        2. Schedule an interview with the admin to verify your identity and discuss your qualifications.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        3. Upon successful verification, the admin will change your role to mentor.
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body1" gutterBottom>
                        We appreciate your interest in becoming a mentor and helping others. If you have any questions, feel free to reach out to the admin using the contact details provided above.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default HomePage;
