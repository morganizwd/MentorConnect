import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchForums, createForum } from '../../redux/slices/forumSlice';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Box } from '@mui/material';

const ForumList = () => {
    const dispatch = useDispatch();
    const forums = useSelector((state) => state.forums.forums);
    const status = useSelector((state) => state.forums.status);
    const error = useSelector((state) => state.forums.error);

    const [searchTitle, setSearchTitle] = useState('');
    const [searchDescription, setSearchDescription] = useState('');
    const [newForumTitle, setNewForumTitle] = useState('');
    const [newForumDescription, setNewForumDescription] = useState('');

    useEffect(() => {
        dispatch(fetchForums());
    }, [dispatch]);

    const handleCreateForum = () => {
        if (newForumTitle.trim() && newForumDescription.trim()) {
            dispatch(createForum({ title: newForumTitle, description: newForumDescription }));
            setNewForumTitle('');
            setNewForumDescription('');
        }
    };

    const filteredForums = forums.filter((forum) =>
        forum.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        forum.description.toLowerCase().includes(searchDescription.toLowerCase())
    );

    if (status === 'loading') {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6">Error: {error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Forums
            </Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search by Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Search by Description"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="New Forum Title"
                    value={newForumTitle}
                    onChange={(e) => setNewForumTitle(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="New Forum Description"
                    value={newForumDescription}
                    onChange={(e) => setNewForumDescription(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleCreateForum}>
                    Create Forum
                </Button>
            </Box>
            <List>
                {filteredForums.map((forum) => (
                    <ListItem button component={Link} to={`/forums/${forum.id}`} key={forum.id}>
                        <ListItemText primary={forum.title} secondary={forum.description} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ForumList;