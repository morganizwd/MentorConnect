import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Thunks для различных действий
export const fetchAuth = createAsyncThunk('user/fetchAuth', async (params) => {
    const { data } = await axios.post('/login', params);
    return data;
});

export const fetchRegister = createAsyncThunk('user/fetchRegister', async (params) => {
    const { data } = await axios.post('/registration', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('user/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth');
    return data;
});

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (userId) => {
    const { data } = await axios.get(`/users/${userId}`);
    return data;
});

export const fetchGetAllUsers = createAsyncThunk('user/fetchGetAllUsers', async () => {
    const { data } = await axios.get('/users');
    return data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId) => {
    await axios.delete(`/users/${userId}`);
    return userId;
});

const initialState = {
    data: null,
    status: 'loading',
    users: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'null';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
                state.data = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                if (!state.data) state.data = {};
                state.data[action.meta.arg] = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchUserById.rejected, (state) => {
                state.status = 'error';
            })
            .addCase(fetchGetAllUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchGetAllUsers.rejected, (state) => {
                state.status = 'error';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            });
    },
});

export const selectIsAuth = (state) => Boolean(state.user.data);

export const userReducer = userSlice.reducer;

export const { logout } = userSlice.actions;