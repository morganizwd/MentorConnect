import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchTagById = createAsyncThunk('tags/fetchTagById', async (id) => {
    const { data } = await axios.get(`/tags/${id}`);
    return data;
});

export const createTag = createAsyncThunk('tags/createTag', async ({ name, userId }) => {
    const { data } = await axios.post('/tags', { name, userId });
    return data;
});

export const updateTag = createAsyncThunk('tags/updateTag', async ({ id, tagData }) => {
    const { data } = await axios.patch(`/tags/${id}`, tagData);
    return data;
});

export const deleteTag = createAsyncThunk('tags/deleteTag', async (id) => {
    await axios.delete(`/tags/${id}`);
    return id;
});

export const fetchTagsByUserId = createAsyncThunk('tags/fetchTagsByUserId', async (userId) => {
    const { data } = await axios.get(`/tags?userId=${userId}`);
    return data;
});

const initialState = {
    tags: [],
    currentTag: null,
    status: 'idle',
    error: null,
};

const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTags.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTagsByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTagsByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tags = action.payload;
            })
            .addCase(fetchTagsByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTagById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTagById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentTag = action.payload;
            })
            .addCase(fetchTagById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.tags.push(action.payload);
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                const index = state.tags.findIndex(tag => tag.id === action.payload.id);
                if (index !== -1) {
                    state.tags[index] = action.payload;
                }
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.tags = state.tags.filter(tag => tag.id !== action.payload);
            });
    },
});

export const tagReducer = tagSlice.reducer;
