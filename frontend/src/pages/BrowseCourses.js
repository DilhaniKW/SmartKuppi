// src/pages/BrowseCourses.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Filter, ChevronLeft, Users, BookOpen, 
  Star, GraduationCap, DollarSign, ExternalLink,
  Loader, AlertCircle, CheckCircle
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';
import CourseCardHeader from '../components/CourseCardHeader';

const API_BASE_URL = 'http://localhost:5000/api';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showEnrollSuccess, setShowEnrollSuccess] = useState(null);
  const navigate = useNavigate();

  const subjects = [
    'All', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Programming', 'Web Development',
    'Database Systems', 'Networking', 'English Literature',
    'Economics', 'Business Studies', 'Accounting'
  ];

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
        setFilteredCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/students/${userData.id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledCourses(data.data.map(c => c._id));
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        setShowEnrollSuccess(courseId);
        setTimeout(() => setShowEnrollSuccess(null), 3000);
      } else {
        alert(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Network error. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  useEffect(() => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(course => course.subject === subjectFilter);
    }
    setFilteredCourses(filtered);
  }, [searchTerm, subjectFilter, courses]);

  const content = (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Browse Courses</h1>
        <p className="text-slate-500 mt-1">Discover and enroll in courses that interest you.</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl focus:outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center bg-slate-50 rounded-2xl px-3 border-2 border-transparent">
              <Filter className="h-4 w-4 text-slate-400 mr-2" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-transparent py-3 text-sm font-medium text-slate-700 focus:outline-none"
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub === 'All' ? 'all' : sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourses.includes(course._id);
            const isEnrolling = enrollingId === course._id;
            const showSuccess = showEnrollSuccess === course._id;

            return (
              <div key={course._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CourseCardHeader course={course} height="h-48">
                  {course.price > 0 ? (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                      LKR {course.price}
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                      Free
                    </span>
                  )}
                </CourseCardHeader>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {course.subject}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs text-slate-600">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledCount || 0} students
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessonCount || 0} lessons
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isEnrolled ? (
                      <Link
                        to={`/student/courses/${course._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Go to Course
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={isEnrolling}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-70"
                      >
                        {isEnrolling ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}
                    {showSuccess && (
                      <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
                        <CheckCircle className="h-4 w-4" />
                        Enrolled successfully!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return <StudentLayout title="Browse Courses">{content}</StudentLayout>;
};

export default BrowseCourses;