import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags, createTag, updateTag, deleteTag } from '../../redux/slices/tagSlice';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const AdminMenu = () => {
  const dispatch = useDispatch();
  const { tags, status, error } = useSelector((state) => state.tags);
  const [form, setForm] = useState({ name: '' });
  const [editingTag, setEditingTag] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTag) {
      try {
        await dispatch(updateTag({ id: editingTag.id, tagData: form })).unwrap();
        setMessage('Tag updated successfully');
        setEditingTag(null);
        setForm({ name: '' });
      } catch (err) {
        setMessage('Error updating tag: ' + err.message);
      }
    } else {
      try {
        await dispatch(createTag(form)).unwrap();
        setMessage('Tag created successfully');
        setForm({ name: '' });
      } catch (err) {
        setMessage('Error creating tag: ' + err.message);
      }
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setForm({ name: tag.name });
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTag(id)).unwrap();
      setMessage('Tag deleted successfully');
    } catch (err) {
      setMessage('Error deleting tag: ' + err.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Menu - Manage Tags
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Tag Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          startIcon={editingTag ? <EditIcon /> : <AddIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          {editingTag ? 'Update Tag' : 'Create Tag'}
        </Button>
      </Box>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {status === 'failed' && <Typography color="error">Error: {error}</Typography>}
      <Paper sx={{ mt: 3 }}>
        <List>
          {tags.map((tag) => (
            <ListItem key={tag.id}>
              <ListItemText primary={tag.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(tag)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(tag.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default AdminMenu;