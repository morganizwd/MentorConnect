import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchFaculties = createAsyncThunk('faculties/fetchFaculties', async () => {
    const { data } = await axios.get('/faculties');
    return data;
});

export const fetchFacultyById = createAsyncThunk('faculties/fetchFacultyById', async (id) => {
    const { data } = await axios.get(`/faculties/${id}`);
    return data;
});

export const createFaculty = createAsyncThunk('faculties/createFaculty', async (facultyData) => {
    const { data } = await axios.post('/faculties', facultyData);
    return data;
});

export const updateFaculty = createAsyncThunk('faculties/updateFaculty', async ({ id, facultyData }) => {
    const { data } = await axios.patch(`/faculties/${id}`, facultyData);
    return data;
});

export const deleteFaculty = createAsyncThunk('faculties/deleteFaculty', async (id) => {
    await axios.delete(`/faculties/${id}`);
    return id;
});

const initialState = {
    faculties: [],
    currentFaculty: null,
    status: 'idle',
    error: null,
};

const facultySlice = createSlice({
    name: 'faculties',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFaculties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFaculties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.faculties = action.payload;
            })
            .addCase(fetchFaculties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFacultyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFacultyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentFaculty = action.payload;
            })
            .addCase(fetchFacultyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createFaculty.fulfilled, (state, action) => {
                state.faculties.push(action.payload);
            })
            .addCase(updateFaculty.fulfilled, (state, action) => {
                const index = state.faculties.findIndex(faculty => faculty.id === action.payload.id);
                if (index !== -1) {
                    state.faculties[index] = action.payload;
                }
            })
            .addCase(deleteFaculty.fulfilled, (state, action) => {
                state.faculties = state.faculties.filter(faculty => faculty.id !== action.payload);
            });
    },
});

export const facultyReducer = facultySlice.reducer;
