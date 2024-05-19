import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchResources = createAsyncThunk('resources/fetchResources', async () => {
    const { data } = await axios.get('/resources');
    return data;
});

export const fetchResourceById = createAsyncThunk('resources/fetchResourceById', async (id) => {
    const { data } = await axios.get(`/resources/${id}`);
    return data;
});

export const createResource = createAsyncThunk('resources/createResource', async (formData) => {
    const { data } = await axios.post('/resources', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
});

export const updateResource = createAsyncThunk('resources/updateResource', async ({ id, formData }) => {
    const { data } = await axios.patch(`/resources/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
});

export const deleteResource = createAsyncThunk('resources/deleteResource', async (id) => {
    await axios.delete(`/resources/${id}`);
    return id;
});

const initialState = {
    resources: [],
    currentResource: null,
    status: 'idle',
    error: null,
};

const resourceSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchResources.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.resources = action.payload;
            })
            .addCase(fetchResources.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchResourceById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchResourceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentResource = action.payload;
            })
            .addCase(fetchResourceById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createResource.fulfilled, (state, action) => {
                state.resources.push(action.payload);
            })
            .addCase(updateResource.fulfilled, (state, action) => {
                const index = state.resources.findIndex(res => res.id === action.payload.id);
                if (index !== -1) {
                    state.resources[index] = action.payload;
                }
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.resources = state.resources.filter(res => res.id !== action.payload);
            });
    },
});

export const resourceReducer = resourceSlice.reducer;