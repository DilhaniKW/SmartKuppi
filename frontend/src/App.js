// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TutorCourses from './pages/TutorCourses';
import TutorCourseCreate from './pages/TutorCourseCreate';
import TutorCourseDetail from './pages/TutorCourseDetail';
import TutorMessages from './pages/TutorMessages';
import StudentCourseDetail from './pages/StudentCourseDetail';

// 👇 Add these imports
import TutorLessonCreate from './pages/TutorLessonCreate';
import TutorResourceUpload from './pages/TutorResourceUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Tutor Routes */}
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/tutor/courses" element={<TutorCourses />} />
        <Route path="/tutor/create-course" element={<TutorCourseCreate />} />
        <Route path="/tutor/courses/:courseId" element={<TutorCourseDetail />} />
        <Route path="/tutor/messages" element={<TutorMessages />} />

        {/* 👇 Add these two new routes */}
        <Route path="/tutor/create-lesson" element={<TutorLessonCreate />} />
        <Route path="/tutor/upload-resource" element={<TutorResourceUpload />} />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses/:courseId" element={<StudentCourseDetail />} />
      </Routes>
    </Router>
  );
}

export default App;