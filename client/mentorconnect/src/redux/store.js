import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/userSlice';
import { tagReducer } from './slices/tagSlice';
import { specializationReducer } from './slices/specializationSlice';
import { resourceReducer } from './slices/resourceSlice';
import { postReducer } from './slices/postSlice';
import { mentorshipSessionReducer } from './slices/mentorshipSessionSlice';
import { mentorReviewReducer } from './slices/mentorReviewSlice';
import { menteeReviewReducer } from './slices/menteeReviewSlice';
import { forumReducer } from './slices/forumSlice';
import { facultyReducer } from './slices/facultySlice';
import { contactReducer } from './slices/contactSlice';
// Импортируйте другие редюсеры по мере их создания

const store = configureStore({
    reducer: {
        user: userReducer,
        tags: tagReducer,
        specializations: specializationReducer,
        resources: resourceReducer,
        posts: postReducer,
        mentorshipSessions: mentorshipSessionReducer,
        mentorReviews: mentorReviewReducer,
        menteeReviews: menteeReviewReducer,
        forums: forumReducer,
        faculties: facultyReducer,
        contacts: contactReducer,
        // Добавьте ваши редюсеры здесь
    },
});

export default store;