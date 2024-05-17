import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchMentorReviews = createAsyncThunk('mentorReviews/fetchMentorReviews', async () => {
    const { data } = await axios.get('/mentor-reviews');
    return data;
});

export const fetchMentorReviewById = createAsyncThunk('mentorReviews/fetchMentorReviewById', async (id) => {
    const { data } = await axios.get(`/mentor-reviews/${id}`);
    return data;
});

export const createMentorReview = createAsyncThunk('mentorReviews/createMentorReview', async (reviewData) => {
    const { data } = await axios.post('/mentor-reviews', reviewData);
    return data;
});

export const updateMentorReview = createAsyncThunk('mentorReviews/updateMentorReview', async ({ id, reviewData }) => {
    const { data } = await axios.patch(`/mentor-reviews/${id}`, reviewData);
    return data;
});

export const deleteMentorReview = createAsyncThunk('mentorReviews/deleteMentorReview', async (id) => {
    await axios.delete(`/mentor-reviews/${id}`);
    return id;
});

const initialState = {
    reviews: [],
    currentReview: null,
    status: 'idle',
    error: null,
};

const mentorReviewSlice = createSlice({
    name: 'mentorReviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMentorReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMentorReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload;
            })
            .addCase(fetchMentorReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMentorReviewById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMentorReviewById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentReview = action.payload;
            })
            .addCase(fetchMentorReviewById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createMentorReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
            })
            .addCase(updateMentorReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
            })
            .addCase(deleteMentorReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
            });
    },
});

export const mentorReviewReducer = mentorReviewSlice.reducer;