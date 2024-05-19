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
} from '@mui/material';

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

    const filteredMentors = users.filter(user => {
        if (user.role !== 'mentor') return false;
        if (searchTerm && !user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) && !user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (selectedTag && !user.tags.map(tag => tag.name).includes(selectedTag.name)) {
            return false;
        }
        return true;
    });

    const apiUrl = 'http://localhost:7000'; // Ensure your API URL is correct

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Search for Mentors
            </Typography>
            <TextField
                fullWidth
                label="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
                {tags.map(tag => (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        onClick={() => setSelectedTag(tag)}
                        onDelete={selectedTag && selectedTag.id === tag.id ? () => setSelectedTag(null) : null}
                        color={selectedTag && selectedTag.id === tag.id ? 'primary' : 'default'}
                        sx={{ mr: 1, mb: 1 }}
                    />
                ))}
            </Box>
            <List>
                {filteredMentors.map(mentor => (
                    <ListItem button component={Link} to={`/mentors/${mentor.id}`} key={mentor.id}>
                        <Avatar src={mentor.avatar ? `${apiUrl}${mentor.avatar}` : ''} alt={`${mentor.firstName} ${mentor.lastName}`} />
                        <ListItemText primary={`${mentor.firstName} ${mentor.lastName}`} secondary={mentor.email} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default MentorSearch;
