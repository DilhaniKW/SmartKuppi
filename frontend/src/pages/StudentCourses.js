// src/pages/StudentCourses.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, Users, GraduationCap, ArrowRight, Search, 
  Filter, Star
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/students/${userData.id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const coursesWithProgress = data.data.map((course, index) => ({
          ...course,
          progress: Math.floor(Math.random() * 100),
          nextLesson: 'Next session: ' + new Date(Date.now() + 86400000).toLocaleDateString(),
          completedLessons: Math.floor(Math.random() * 20),
          totalLessons: 20,
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString()
        }));
        setCourses(coursesWithProgress);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setMockCourses();
    } finally {
      setLoading(false);
    }
  };

  const setMockCourses = () => {
    setCourses([
      {
        _id: '1',
        title: 'Advanced JavaScript',
        subject: 'Programming',
        description: 'Master modern JavaScript concepts including closures, promises, async/await, and more.',
        tutor: { name: 'Dr. Kamal Perera' },
        progress: 65,
        nextLesson: 'Closures & Scope',
        completedLessons: 13,
        totalLessons: 20,
        lastAccessed: new Date().toISOString(),
        thumbnail: null
      },
      {
        _id: '2',
        title: 'React Masterclass',
        subject: 'Web Development',
        description: 'Learn React from basics to advanced patterns, hooks, and state management.',
        tutor: { name: 'Ms. Nimali Silva' },
        progress: 40,
        nextLesson: 'Hooks Deep Dive',
        completedLessons: 8,
        totalLessons: 20,
        lastAccessed: new Date(Date.now() - 86400000).toISOString(),
        thumbnail: null
      }
    ]);
  };

  const getSortedCourses = () => {
    let sorted = [...courses];
    if (searchTerm) {
      sorted = sorted.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch(sortBy) {
      case 'progress':
        sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sorted.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
        break;
    }
    return sorted;
  };

  const filteredCourses = getSortedCourses();

  // Create the content JSX
  const content = (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-slate-500 mt-1">Continue your learning journey</p>
        </div>
        <Link 
          to="/browse-courses" 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
        >
          <GraduationCap className="h-4 w-4" />
          Browse More Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Courses</p>
          <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Progress</p>
          <p className="text-2xl font-bold text-emerald-600">
            {Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / (courses.length || 1))}%
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completed Lessons</p>
          <p className="text-2xl font-bold text-blue-600">
            {courses.reduce((acc, c) => acc + (c.completedLessons || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Learning Streak</p>
          <p className="text-2xl font-bold text-amber-600">12 days</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl focus:outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl focus:outline-none transition-all text-sm font-medium text-slate-700"
            >
              <option value="recent">Recently Accessed</option>
              <option value="progress">Progress</option>
              <option value="title">Course Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500">
            {searchTerm ? 'Try a different search term.' : "You haven't enrolled in any courses yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course._id} to={`/student/courses/${course._id}`} className="block">
              <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-48 overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-white/60" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {course.subject || 'Course'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs text-slate-600">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-indigo-600">{course.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress || 0}%` }} className="h-full bg-indigo-600 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.completedLessons || 0}/{course.totalLessons || 20} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.nextLesson || 'No upcoming'}</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all group/btn">
                    <span>Continue Learning</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  // Wrap the content with StudentLayout and return
  return <StudentLayout title="My Courses">{content}</StudentLayout>;
};

export default StudentCourses;