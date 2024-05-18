import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMentorshipSessions,
  createMentorshipSession,
  updateMentorshipSession,
  deleteMentorshipSession,
} from '../../redux/slices/mentorshipSessionSlice';
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

const AdminMentorshipSessions = () => {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.mentorshipSessions.sessions);
  const status = useSelector((state) => state.mentorshipSessions.status);
  const error = useSelector((state) => state.mentorshipSessions.error);

  const [form, setForm] = useState({
    scheduledTime: '',
    isFinished: false,
    mentorId: '',
    menteeId: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMentorshipSessions());
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
      dispatch(updateMentorshipSession({ id: editingId, sessionData: form }));
      setEditingId(null);
    } else {
      dispatch(createMentorshipSession(form));
    }

    setForm({
      scheduledTime: '',
      isFinished: false,
      mentorId: '',
      menteeId: '',
    });
  };

  const handleEdit = (session) => {
    setEditingId(session.id);
    setForm({
      scheduledTime: session.scheduledTime,
      isFinished: session.isFinished,
      mentorId: session.mentorId,
      menteeId: session.menteeId,
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteMentorshipSession(id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Mentorship Sessions
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="scheduledTime"
          label="Scheduled Time"
          name="scheduledTime"
          type="datetime-local"
          value={form.scheduledTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="isFinished"
          label="Is Finished"
          name="isFinished"
          value={form.isFinished}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="mentorId"
          label="Mentor ID"
          name="mentorId"
          value={form.mentorId}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="menteeId"
          label="Mentee ID"
          name="menteeId"
          value={form.menteeId}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {editingId ? 'Update Session' : 'Create Session'}
        </Button>
      </Box>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <List>
        {sessions.map((session) => (
          <ListItem key={session.id}>
            <ListItemText
              primary={`Scheduled Time: ${new Date(session.scheduledTime).toLocaleString()}`}
              secondary={`Mentor ID: ${session.mentorId}, Mentee ID: ${session.menteeId}, Is Finished: ${session.isFinished}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(session)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(session.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminMentorshipSessions;
