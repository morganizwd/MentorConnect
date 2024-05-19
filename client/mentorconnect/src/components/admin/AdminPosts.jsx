import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from '../../redux/slices/postSlice';
import { fetchForums } from '../../redux/slices/forumSlice';
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
  Pagination,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const AdminPosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const forums = useSelector((state) => state.forums.forums);
  const postStatus = useSelector((state) => state.posts.status);
  const forumStatus = useSelector((state) => state.forums.status);
  const postError = useSelector((state) => state.posts.error);
  const forumError = useSelector((state) => state.forums.error);

  const [form, setForm] = useState({
    content: '',
    forumId: '',
  });
  const [filters, setFilters] = useState({
    forumId: '',
    searchText: '',
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchForums());
  }, [dispatch]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
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

  const getForumNameById = (id) => {
    const forum = forums.find((forum) => forum.id === id);
    return forum ? forum.title : 'Unknown Forum';
  };

  const filterPosts = () => {
    return posts.filter((post) => {
      const matchesForum = filters.forumId ? post.forumId === filters.forumId : true;
      const matchesText = filters.searchText ? post.content.toLowerCase().includes(filters.searchText.toLowerCase()) : true;
      const matchesStartDate = filters.startDate ? new Date(post.createdAt) >= new Date(filters.startDate) : true;
      const matchesEndDate = filters.endDate ? new Date(post.createdAt) <= new Date(filters.endDate) : true;

      return matchesForum && matchesText && matchesStartDate && matchesEndDate;
    });
  };

  const paginatedPosts = () => {
    const filteredPosts = filterPosts();
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
          onChange={handleFormChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="forumId-label">Forum</InputLabel>
          <Select
            labelId="forumId-label"
            id="forumId"
            name="forumId"
            value={form.forumId}
            onChange={handleFormChange}
            label="Forum"
          >
            {forums.map((forum) => (
              <MenuItem key={forum.id} value={forum.id}>
                {forum.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {editingId ? 'Update Post' : 'Create Post'}
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="filter-forumId-label">Filter by Forum</InputLabel>
          <Select
            labelId="filter-forumId-label"
            id="filter-forumId"
            name="forumId"
            value={filters.forumId}
            onChange={handleFilterChange}
            label="Filter by Forum"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {forums.map((forum) => (
              <MenuItem key={forum.id} value={forum.id}>
                {forum.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="searchText"
          label="Search by Text"
          name="searchText"
          value={filters.searchText}
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
      {postStatus === 'loading' && <p>Loading posts...</p>}
      {forumStatus === 'loading' && <p>Loading forums...</p>}
      {postError && <p>Error: {postError}</p>}
      {forumError && <p>Error: {forumError}</p>}
      <List>
        {paginatedPosts().map((post) => (
          <ListItem key={post.id}>
            <ListItemText
              primary={post.content}
              secondary={
                <>
                  <div>Forum: {getForumNameById(post.forumId)}</div>
                  <div>Created At: {new Date(post.createdAt).toLocaleString()}</div>
                  <div>Updated At: {new Date(post.updatedAt).toLocaleString()}</div>
                </>
              }
            />
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
      <Pagination
        count={Math.ceil(filterPosts().length / postsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
    </Container>
  );
};

export default AdminPosts;
