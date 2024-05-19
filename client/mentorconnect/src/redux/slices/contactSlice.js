import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks для взаимодействия с API
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
    const { data } = await axios.get('/contacts');
    return data;
});

export const fetchContactsByUserId = createAsyncThunk('contacts/fetchContactsByUserId', async (userId) => {
    const { data } = await axios.get(`/contacts?userId=${userId}`);
    return data;
});

export const fetchContactById = createAsyncThunk('contacts/fetchContactById', async (id) => {
    const { data } = await axios.get(`/contacts/${id}`);
    return data;
});

export const createContact = createAsyncThunk('contacts/createContact', async (contactData) => {
    const { data } = await axios.post('/contacts', contactData);
    return data;
});

export const updateContact = createAsyncThunk('contacts/updateContact', async ({ id, contactData }) => {
    const { data } = await axios.patch(`/contacts/${id}`, contactData);
    return data;
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id) => {
    await axios.delete(`/contacts/${id}`);
    return id;
});

const initialState = {
    contacts: [],
    currentContact: null,
    status: 'idle',
    error: null,
};

const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchContactsByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContactsByUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contacts = action.payload;
            })
            .addCase(fetchContactsByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchContactById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContactById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentContact = action.payload;
            })
            .addCase(fetchContactById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createContact.fulfilled, (state, action) => {
                state.contacts.push(action.payload);
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
                if (index !== -1) {
                    state.contacts[index] = action.payload;
                }
            })
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
            });
    },
});

export const contactReducer = contactSlice.reducer;