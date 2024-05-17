import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchForums = createAsyncThunk('forums/fetchForums', async () => {
    const { data } = await axios.get('/forums');
    return data;
});

export const fetchForumById = createAsyncThunk('forums/fetchForumById', async (id) => {
    const { data } = await axios.get(`/forums/${id}`);
    return data;
});

export const createForum = createAsyncThunk('forums/createForum', async (forumData) => {
    const { data } = await axios.post('/forums', forumData);
    return data;
});

export const updateForum = createAsyncThunk('forums/updateForum', async ({ id, forumData }) => {
    const { data } = await axios.patch(`/forums/${id}`, forumData);
    return data;
});

export const deleteForum = createAsyncThunk('forums/deleteForum', async (id) => {
    await axios.delete(`/forums/${id}`);
    return id;
});

const initialState = {
    forums: [],
    currentForum: null,
    status: 'idle',
    error: null,
};

const forumSlice = createSlice({
    name: 'forums',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchForums.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchForums.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.forums = action.payload;
            })
            .addCase(fetchForums.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchForumById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchForumById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentForum = action.payload;
            })
            .addCase(fetchForumById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createForum.fulfilled, (state, action) => {
                state.forums.push(action.payload);
            })
            .addCase(updateForum.fulfilled, (state, action) => {
                const index = state.forums.findIndex(forum => forum.id === action.payload.id);
                if (index !== -1) {
                    state.forums[index] = action.payload;
                }
            })
            .addCase(deleteForum.fulfilled, (state, action) => {
                state.forums = state.forums.filter(forum => forum.id !== action.payload);
            });
    },
});

export const forumReducer = forumSlice.reducer;
