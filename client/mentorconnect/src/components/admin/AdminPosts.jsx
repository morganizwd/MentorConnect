import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from '../../redux/slices/postSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const AdminPosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const [form, setForm] = useState({
    content: '',
    forumId: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      dispatch(updatePost({ id: editingId, postData: form }));
      setEditingId(null);
    } else {
      dispatch(createPost(form));
    }

    setForm({
      content: '',
      forumId: '',
    });
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      content: post.content,
      forumId: post.forumId,
    });
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Posts
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="content"
          label="Content"
          name="content"
          autoComplete="content"
          autoFocus
          value={form.content}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="forumId"
          label="Forum ID"
          name="forumId"
          autoComplete="forumId"
          value={form.forumId}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {editingId ? 'Update Post' : 'Create Post'}
        </Button>
      </Box>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <List>
        {posts.map((post) => (
          <ListItem key={post.id}>
            <ListItemText primary={post.content} secondary={`Forum ID: ${post.forumId}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(post)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(post.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminPosts;