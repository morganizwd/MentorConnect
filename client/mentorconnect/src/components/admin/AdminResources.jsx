import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
} from '../../redux/slices/resourceSlice';
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

const AdminResources = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources.resources);
  const status = useSelector((state) => state.resources.status);
  const error = useSelector((state) => state.resources.error);

  const [form, setForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (editingId) {
      dispatch(updateResource({ id: editingId, resourceData: formData }));
      setEditingId(null);
    } else {
      dispatch(createResource(formData));
    }

    setForm({
      title: '',
      description: '',
      file: null,
    });
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      description: resource.description,
      file: null,
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteResource(id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Resources
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoComplete="title"
          autoFocus
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          autoComplete="description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          accept="*"
          style={{ display: 'none' }}
          id="file"
          type="file"
          name="file"
          onChange={handleChange}
        />
        <label htmlFor="file">
          <Button variant="contained" component="span">
            Upload File
          </Button>
        </label>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {editingId ? 'Update Resource' : 'Create Resource'}
        </Button>
      </Box>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <List>
        {resources.map((resource) => (
          <ListItem key={resource.id}>
            <ListItemText primary={resource.title} secondary={resource.description} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(resource)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(resource.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminResources;