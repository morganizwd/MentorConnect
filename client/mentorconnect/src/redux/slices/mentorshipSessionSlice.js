import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchMentorshipSessions = createAsyncThunk('mentorshipSessions/fetchMentorshipSessions', async () => {
    const { data } = await axios.get('/mentorshipSessions');
    return data;
});

export const fetchMentorshipSessionById = createAsyncThunk('mentorshipSessions/fetchMentorshipSessionById', async (id) => {
    const { data } = await axios.get(`/mentorshipSessions/${id}`);
    return data;
});

export const createMentorshipSession = createAsyncThunk('mentorshipSessions/createMentorshipSession', async (sessionData) => {
    const { data } = await axios.post('/mentorshipSessions', sessionData);
    return data;
});

export const updateMentorshipSession = createAsyncThunk('mentorshipSessions/updateMentorshipSession', async ({ id, sessionData }) => {
    const { data } = await axios.patch(`/mentorshipSessions/${id}`, sessionData);
    return data;
});

export const deleteMentorshipSession = createAsyncThunk('mentorshipSessions/deleteMentorshipSession', async (id) => {
    await axios.delete(`/mentorshipSessions/${id}`);
    return id;
});

const initialState = {
    sessions: [],
    currentSession: null,
    newSessions: [],
    status: 'idle',
    error: null,
};

const mentorshipSessionSlice = createSlice({
    name: 'mentorshipSessions',
    initialState,
    reducers: {
        markAllAsRead: (state) => {
            state.newSessions = [];
        },
        markSessionAsRead: (state, action) => {
            state.newSessions = state.newSessions.filter(session => session.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMentorshipSessions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMentorshipSessions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sessions = action.payload;
                state.newSessions = action.payload.filter(session => !session.isRead);
            })
            .addCase(fetchMentorshipSessions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMentorshipSessionById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMentorshipSessionById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentSession = action.payload;
            })
            .addCase(fetchMentorshipSessionById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMentorshipSession.fulfilled, (state, action) => {
                state.sessions.push(action.payload);
                state.newSessions.push(action.payload);
            })
            .addCase(updateMentorshipSession.fulfilled, (state, action) => {
                const index = state.sessions.findIndex(session => session.id === action.payload.id);
                if (index !== -1) {
                    state.sessions[index] = action.payload;
                    const newSessionIndex = state.newSessions.findIndex(session => session.id === action.payload.id);
                    if (newSessionIndex !== -1) {
                        state.newSessions[newSessionIndex] = action.payload;
                    }
                }
            })
            .addCase(deleteMentorshipSession.fulfilled, (state, action) => {
                state.sessions = state.sessions.filter(session => session.id !== action.payload);
                state.newSessions = state.newSessions.filter(session => session.id !== action.payload);
            });
    },
});

export const { markAllAsRead, markSessionAsRead } = mentorshipSessionSlice.actions;
export default mentorshipSessionSlice.reducer;
