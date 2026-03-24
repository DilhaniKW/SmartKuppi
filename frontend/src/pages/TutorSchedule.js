// src/pages/TutorSchedule.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, Video, 
  BookOpen, Users, ExternalLink, Plus, Filter, X,
  CheckCircle, XCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorSchedule = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [view, setView] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScheduleData();
  }, []);

  useEffect(() => {
    filterLessonsByDate();
  }, [selectedDate, lessons, filterCourse]);

  const fetchScheduleData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const tutorData = JSON.parse(localStorage.getItem('user'));
    
    try {
      // Fetch tutor's courses
      const coursesRes = await fetch(`${API_BASE_URL}/courses/tutor/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const coursesData = await coursesRes.json();
      
      if (coursesData.success) {
        setCourses(coursesData.data);
        
        // Fetch lessons for each course
        let allLessons = [];
        for (const course of coursesData.data) {
          const lessonsRes = await fetch(`${API_BASE_URL}/lessons/courses/${course._id}/lessons`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const lessonsData = await lessonsRes.json();
          if (lessonsData.success) {
            const lessonsWithCourse = lessonsData.data.map(lesson => ({
              ...lesson,
              courseTitle: course.title,
              courseId: course._id,
              courseSubject: course.subject,
              enrolledCount: course.enrolledCount || 0
            }));
            allLessons = [...allLessons, ...lessonsWithCourse];
          }
        }
        
        // Sort by date
        allLessons.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLessons(allLessons);
        filterLessonsByDate(allLessons);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const filterLessonsByDate = (lessonsData = lessons) => {
    let filtered = lessonsData.filter(lesson => 
      isSameDay(parseISO(lesson.date), selectedDate)
    );
    
    if (filterCourse !== 'all') {
      filtered = filtered.filter(lesson => lesson.courseId === filterCourse);
    }
    
    setFilteredLessons(filtered);
  };

  const setMockData = () => {
    const mockLessons = [
      {
        _id: '1',
        title: 'Advanced JavaScript: Closures & Scope',
        description: 'Deep dive into JavaScript closures and scope chains',
        date: new Date().toISOString(),
        duration: 60,
        meetingLink: 'https://meet.google.com/xxx-xxxx-xxx',
        courseTitle: 'Advanced JavaScript',
        courseId: '1',
        courseSubject: 'Programming',
        enrolledCount: 24
      },
      {
        _id: '2',
        title: 'React Hooks Workshop',
        description: 'Learn useEffect, useState, and custom hooks',
        date: new Date(Date.now() + 86400000).toISOString(),
        duration: 90,
        meetingLink: 'https://zoom.us/j/123456789',
        courseTitle: 'React Masterclass',
        courseId: '2',
        courseSubject: 'Web Development',
        enrolledCount: 18
      },
      {
        _id: '3',
        title: 'Pandas Data Manipulation',
        description: 'Working with DataFrames and Series',
        date: new Date(Date.now() + 172800000).toISOString(),
        duration: 60,
        meetingLink: 'https://meet.google.com/yyy-yyyy-yyy',
        courseTitle: 'Python for Data Science',
        courseId: '3',
        courseSubject: 'Data Science',
        enrolledCount: 12
      }
    ];
    setLessons(mockLessons);
    filterLessonsByDate(mockLessons);
    
    setCourses([
      { _id: '1', title: 'Advanced JavaScript', subject: 'Programming' },
      { _id: '2', title: 'React Masterclass', subject: 'Web Development' },
      { _id: '3', title: 'Python for Data Science', subject: 'Data Science' }
    ]);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasLesson = lessons.some(lesson => isSameDay(parseISO(lesson.date), date));
      if (hasLesson) {
        return <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mx-auto mt-1"></div>;
      }
    }
    return null;
  };

  const getUpcomingLessons = () => {
    const now = new Date();
    return lessons
      .filter(lesson => new Date(lesson.date) > now)
      .slice(0, 5);
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (date) => {
    const lessonDate = new Date(date);
    const now = new Date();
    if (lessonDate < now) {
      return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">Past</span>;
    }
    return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">Upcoming</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Teaching Schedule</h1>
            <p className="text-slate-500 mt-1">View all your upcoming lessons and classes</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'calendar' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            List View
          </button>
          <Link
            to="/tutor/create-lesson"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            New Lesson
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Lessons</p>
          <p className="text-2xl font-bold text-slate-900">{lessons.length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">This Week</p>
          <p className="text-2xl font-bold text-indigo-600">
            {lessons.filter(l => {
              const lessonDate = new Date(l.date);
              const weekStart = startOfWeek(new Date());
              const weekEnd = endOfWeek(new Date());
              return lessonDate >= weekStart && lessonDate <= weekEnd;
            }).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-emerald-600">
            {lessons.filter(l => new Date(l.date) > new Date()).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
          <p className="text-2xl font-bold text-blue-600">
            {lessons.reduce((sum, l) => sum + (l.enrolledCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filter by course:</span>
          </div>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl focus:outline-none transition-all text-sm font-medium text-slate-700"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {view === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                <div className="calendar-container custom-calendar">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="w-full border-none font-sans"
                    next2Label={null}
                    prev2Label={null}
                  />
                </div>
                
                <style>{`
                  .custom-calendar .react-calendar {
                    width: 100%;
                    border: none;
                    font-family: inherit;
                  }
                  .custom-calendar .react-calendar__navigation {
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  }
                  .custom-calendar .react-calendar__navigation button {
                    min-width: 44px;
                    background: none;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0f172a;
                    border-radius: 12px;
                    padding: 8px;
                    transition: all 0.2s;
                  }
                  .custom-calendar .react-calendar__navigation button:hover {
                    background-color: #f8fafc;
                  }
                  .custom-calendar .react-calendar__month-view__weekdays {
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    letter-spacing: 0.05em;
                    margin-bottom: 1rem;
                  }
                  .custom-calendar .react-calendar__month-view__days__day {
                    padding: 1rem 0;
                    font-weight: 600;
                    color: #475569;
                    border-radius: 16px;
                    transition: all 0.2s;
                  }
                  .custom-calendar .react-calendar__month-view__days__day:hover {
                    background-color: #f1f5f9;
                  }
                  .custom-calendar .react-calendar__tile--now {
                    background: #eff6ff;
                    color: #2563eb;
                  }
                  .custom-calendar .react-calendar__tile--active {
                    background: #2563eb !important;
                    color: white !important;
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
                  }
                `}</style>
              </div>

              {/* Selected Date Lessons */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map(lesson => (
                      <div key={lesson._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm">
                            <Video className="h-4 w-4" />
                          </div>
                          {getStatusBadge(lesson.date)}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{lesson.courseTitle}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(lesson.date)}</span>
                          <span>•</span>
                          <span>{lesson.duration} min</span>
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          <span>{lesson.enrolledCount || 0} students</span>
                        </div>
                        {lesson.meetingLink && (
                          <div className="flex gap-2">
                            <a
                              href={lesson.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                            >
                              Start Session <ExternalLink className="h-3 w-3" />
                            </a>
                            <Link
                              to={`/tutor/courses/${lesson.courseId}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600"
                            >
                              View Course
                            </Link>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No lessons scheduled for this day</p>
                      <Link
                        to="/tutor/create-lesson"
                        className="inline-block mt-4 text-indigo-600 text-sm font-bold hover:underline"
                      >
                        Schedule a lesson
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">All Upcoming Lessons</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {lessons.filter(l => new Date(l.date) >= new Date()).length === 0 ? (
                  <div className="p-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No upcoming lessons scheduled</p>
                    <Link
                      to="/tutor/create-lesson"
                      className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
                    >
                      Create New Lesson
                    </Link>
                  </div>
                ) : (
                  lessons
                    .filter(l => new Date(l.date) >= new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(lesson => (
                      <div key={lesson._id} className="p-6 hover:bg-slate-50 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Video className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">{lesson.title}</h3>
                              <p className="text-sm text-slate-500">{lesson.courseTitle} • {lesson.courseSubject}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {new Date(lesson.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(lesson.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {lesson.enrolledCount || 0} enrolled
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            {lesson.meetingLink && (
                              <a
                                href={lesson.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
                              >
                                Start Session
                              </a>
                            )}
                            <Link
                              to={`/tutor/courses/${lesson.courseId}`}
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                            >
                              View Course
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default TutorSchedule;