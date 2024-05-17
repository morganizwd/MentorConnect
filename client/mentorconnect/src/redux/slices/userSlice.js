import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Thunks для различных действий
export const fetchAuth = createAsyncThunk('user/fetchAuth', async (params) => {
    const { data } = await axios.post('/users/login', params);
    return data;
});

export const fetchRegister = createAsyncThunk('user/fetchRegister', async (params) => {
    const { data } = await axios.post('/users/registration', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('user/fetchAuthMe', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const { data } = await axios.get('/users/auth');
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
            localStorage.removeItem('token'); // Удаление токена из localStorage при логауте
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
                localStorage.setItem('token', action.payload.token); // Сохранение токена в localStorage
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
                localStorage.setItem('token', action.payload.token); // Сохранение токена в localStorage
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
