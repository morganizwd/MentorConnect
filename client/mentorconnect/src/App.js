import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchAuthMe, selectIsAuth } from './redux/slices/userSlice';
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
import UserProfile from './components/UserProfile';
import ForumList from './components/forums/ForumList';
import Forum from './components/forums/Forum';
import Resources from './components/Resources/Resources';
import MentorProfile from './components/MentorSearch/MentorProfile';
import MentorSearch from './components/MentorSearch/MentorSearch';
import MySessions from './components/Sessions/MySessions';
import Menu from './components/Menu';
import HomePage from './components/HomePage';

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
      <div style={{ display: 'flex' }}>
        {isAuth && <Menu />}
        <div style={{ flex: 1, padding: 20 }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<HomePage />} />

            <Route path="/admin/tags" element={<AdminTagMenu />} />
            <Route path="/admin/specializations" element={<AdminSpecializations />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/mentorship-sessions" element={<AdminMentorshipSessions />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/forums" element={<AdminForums />} />
            <Route path="/admin/faculties" element={<AdminFaculties />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />

            <Route path="/profile" element={<UserProfile />} />

            <Route exact path="/forums" element={<ForumList />} />
            <Route path="/forums/:id" element={<Forum />} />

            <Route path='/resourses' element={<Resources />} />

            <Route path='/mentors' element={<MentorSearch />} />
            <Route path="/mentors/:id" element={<MentorProfile />} />

            <Route path="/sessions" element={<MySessions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
