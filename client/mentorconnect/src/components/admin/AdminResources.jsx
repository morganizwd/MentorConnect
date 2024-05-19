import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
} from '../../redux/slices/resourceSlice';
import { fetchGetAllUsers } from '../../redux/slices/userSlice';
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import axios from '../../redux/axios';

const AdminResources = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources.resources);
  const status = useSelector((state) => state.resources.status);
  const error = useSelector((state) => state.resources.error);
  const users = useSelector((state) => state.user.users);

  const [form, setForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [filters, setFilters] = useState({
    title: '',
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchResources());
    dispatch(fetchGetAllUsers());
  }, [dispatch]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (editingId) {
      dispatch(updateResource({ id: editingId, formData: formData }));
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

  const handleDownload = async (id, title) => {
    try {
      const response = await axios.get(`/resources/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/['"]/g, '') : title;
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading file', err);
    }
  };

  const getAuthorNameById = (id) => {
    const author = users.find((user) => user.id === id);
    return author ? `${author.firstName} ${author.lastName}` : 'Unknown Author';
  };

  const filterResources = () => {
    return resources.filter((resource) => {
      const matchesTitle = filters.title ? resource.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesStartDate = filters.startDate ? new Date(resource.createdAt) >= new Date(filters.startDate) : true;
      const matchesEndDate = filters.endDate ? new Date(resource.createdAt) <= new Date(filters.endDate) : true;

      return matchesTitle && matchesStartDate && matchesEndDate;
    });
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
          onChange={handleFormChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          autoComplete="description"
          value={form.description}
          onChange={handleFormChange}
        />
        <input
          accept="*"
          style={{ display: 'none' }}
          id="file"
          type="file"
          name="file"
          onChange={handleFormChange}
        />
        <label htmlFor="file">
          <Button variant="contained" component="span">
            {form.file ? form.file.name : 'Upload File'}
          </Button>
        </label>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {editingId ? 'Update Resource' : 'Create Resource'}
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          id="filter-title"
          label="Filter by Title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="startDate"
          label="Filter by Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="endDate"
          label="Filter by End Date"
          name="endDate"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </Box>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <List>
        {filterResources().map((resource) => (
          <ListItem key={resource.id}>
            <ListItemText
              primary={resource.title}
              secondary={
                <>
                  <div>Description: {resource.description}</div>
                  <div>Author: {getAuthorNameById(resource.userId)}</div>
                  <div>Created At: {new Date(resource.createdAt).toLocaleString()}</div>
                  <div>Updated At: {new Date(resource.updatedAt).toLocaleString()}</div>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="download" onClick={() => handleDownload(resource.id, resource.title)}>
                <GetAppIcon />
              </IconButton>
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