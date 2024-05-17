import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchMenteeReviews = createAsyncThunk('menteeReviews/fetchMenteeReviews', async () => {
    const { data } = await axios.get('/mentee-reviews');
    return data;
});

export const fetchMenteeReviewById = createAsyncThunk('menteeReviews/fetchMenteeReviewById', async (id) => {
    const { data } = await axios.get(`/mentee-reviews/${id}`);
    return data;
});

export const createMenteeReview = createAsyncThunk('menteeReviews/createMenteeReview', async (reviewData) => {
    const { data } = await axios.post('/mentee-reviews', reviewData);
    return data;
});

export const updateMenteeReview = createAsyncThunk('menteeReviews/updateMenteeReview', async ({ id, reviewData }) => {
    const { data } = await axios.patch(`/mentee-reviews/${id}`, reviewData);
    return data;
});

export const deleteMenteeReview = createAsyncThunk('menteeReviews/deleteMenteeReview', async (id) => {
    await axios.delete(`/mentee-reviews/${id}`);
    return id;
});

const initialState = {
    reviews: [],
    currentReview: null,
    status: 'idle',
    error: null,
};

const menteeReviewSlice = createSlice({
    name: 'menteeReviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenteeReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenteeReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload;
            })
            .addCase(fetchMenteeReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMenteeReviewById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenteeReviewById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentReview = action.payload;
            })
            .addCase(fetchMenteeReviewById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMenteeReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
            })
            .addCase(updateMenteeReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(deleteMenteeReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
            });
    },
});

export const menteeReviewReducer = menteeReviewSlice.reducer;