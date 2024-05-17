import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchSpecializations = createAsyncThunk('specializations/fetchSpecializations', async () => {
    const { data } = await axios.get('/specializations');
    return data;
});

export const fetchSpecializationById = createAsyncThunk('specializations/fetchSpecializationById', async (id) => {
    const { data } = await axios.get(`/specializations/${id}`);
    return data;
});

export const createSpecialization = createAsyncThunk('specializations/createSpecialization', async (specializationData) => {
    const { data } = await axios.post('/specializations', specializationData);
    return data;
});

export const updateSpecialization = createAsyncThunk('specializations/updateSpecialization', async ({ id, specializationData }) => {
    const { data } = await axios.patch(`/specializations/${id}`, specializationData);
    return data;
});

export const deleteSpecialization = createAsyncThunk('specializations/deleteSpecialization', async (id) => {
    await axios.delete(`/specializations/${id}`);
    return id;
});

const initialState = {
    specializations: [],
    currentSpecialization: null,
    status: 'idle',
    error: null,
};

const specializationSlice = createSlice({
    name: 'specializations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpecializations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSpecializations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.specializations = action.payload;
            })
            .addCase(fetchSpecializations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSpecializationById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSpecializationById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentSpecialization = action.payload;
            })
            .addCase(fetchSpecializationById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createSpecialization.fulfilled, (state, action) => {
                state.specializations.push(action.payload);
            })
            .addCase(updateSpecialization.fulfilled, (state, action) => {
                const index = state.specializations.findIndex(spec => spec.id === action.payload.id);
                if (index !== -1) {
                    state.specializations[index] = action.payload;
                }
            })
            .addCase(deleteSpecialization.fulfilled, (state, action) => {
                state.specializations = state.specializations.filter(spec => spec.id !== action.payload);
            });
    },
});

export const specializationReducer = specializationSlice.reducer;