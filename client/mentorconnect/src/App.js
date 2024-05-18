import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchAuthMe } from './redux/slices/userSlice';
import Register from './components/Register';
import Login from './components/Login';
import AdminTagMenu from './components/admin/AdminTagMenu';
import AdminSpecializations from './components/admin/AdminSpecializations';
import AdminResources from './components/admin/AdminResources';
import AdminPosts from './components/admin/AdminPosts';
import AdminMentorshipSessions from './components/admin/AdminMentorshipSessions';
import AdminReviews from './components/admin/AdminReviews';
import AdminForums from './components/admin/AdminForums';
import AdminFaculties from './components/admin/AdminFaculty';
import AdminContacts from './components/admin/AdminContacts';
import { useSelector } from 'react-redux';
import { selectIsAuth } from './redux/slices/userSlice';
// import Home from './components/Home'; 

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/admin/tags" element={<AdminTagMenu />} />
        <Route path="/admin/specializations" element={<AdminSpecializations />} />
        <Route path="/admin/resources" element={<AdminResources />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/admin/mentorship-sessions" element={<AdminMentorshipSessions />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/forums" element={<AdminForums />} />
        <Route path="/admin/faculties" element={<AdminFaculties />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Routes>
    </Router>
  );
};

export default App;
