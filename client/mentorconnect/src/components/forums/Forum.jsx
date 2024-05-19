import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchForumById } from '../../redux/slices/forumSlice';
import { fetchPosts, createPost } from '../../redux/slices/postSlice';
import { fetchUserById } from '../../redux/slices/userSlice';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Box,
    Avatar,
    ListItemAvatar,
    Pagination,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';

const Forum = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const forum = useSelector((state) => state.forums.currentForum);
    const posts = useSelector((state) => state.posts.posts);
    const users = useSelector((state) => state.user.users);
    const [newPost, setNewPost] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchForumById(id));
        dispatch(fetchPosts());
    }, [dispatch, id]);

    useEffect(() => {
        posts.forEach(post => {
            if (!users.find(user => user.id === post.authorId)) {
                dispatch(fetchUserById(post.authorId));
            }
        });
    }, [posts, dispatch, users]);

    const handleCreatePost = () => {
        if (newPost.trim()) {
            dispatch(createPost({ content: newPost, forumId: id }));
            setNewPost('');
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handlePostsPerPageChange = (event) => {
        setPostsPerPage(event.target.value);
        setCurrentPage(1); // Reset to the first page when posts per page changes
    };

    const sortedPosts = posts
        .filter((post) => post.forumId === parseInt(id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

    const apiUrl = 'http://localhost:7000';

    return (
        <Container>
            {forum && (
                <>
                    <Typography variant="h4" gutterBottom>
                        {forum.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {forum.description}
                    </Typography>
                    <Box>
                        <TextField
                            fullWidth
                            label="New Post"
                            multiline
                            rows={4}
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" onClick={handleCreatePost}>
                            Add Post
                        </Button>
                    </Box>
                    <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
                        <InputLabel id="posts-per-page-label">Posts Per Page</InputLabel>
                        <Select
                            labelId="posts-per-page-label"
                            id="posts-per-page"
                            value={postsPerPage}
                            onChange={handlePostsPerPageChange}
                            label="Posts Per Page"
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                        </Select>
                    </FormControl>
                    <List>
                        {currentPosts.map((post) => {
                            const author = users.find(user => user.id === post.authorId);
                            return (
                                <ListItem key={post.id}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={author && author.avatar ? `${apiUrl}${author.avatar}` : ''}
                                            alt={author ? `${author.firstName} ${author.lastName}` : 'Author'}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={post.content}
                                        secondary={`By ${author ? `${author.firstName} ${author.lastName}` : `Author ID: ${post.authorId}`} on ${new Date(post.createdAt).toLocaleString()}`}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                    <Pagination
                        count={Math.ceil(sortedPosts.length / postsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{ mt: 2 }}
                    />
                </>
            )}
        </Container>
    );
};

export default Forum;
