// src/pages/StudentSchedule.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { 
  Calendar as CalendarIcon, Clock, Video, BookOpen, 
  Users, ExternalLink, Filter
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [view, setView] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  useEffect(() => {
    filterLessonsByDate();
  }, [selectedDate, lessons, filterCourse]);

  const fetchScheduleData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    try {
      const coursesRes = await fetch(`${API_BASE_URL}/enrollments/students/${userData.id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const coursesData = await coursesRes.json();
      
      if (coursesData.success) {
        setCourses(coursesData.data);
        
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
              tutor: course.tutor?.name || 'Unknown Tutor'
            }));
            allLessons = [...allLessons, ...lessonsWithCourse];
          }
        }
        
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
        date: new Date().toISOString(),
        duration: 60,
        meetingLink: 'https://meet.google.com/xxx-xxxx-xxx',
        courseTitle: 'Advanced JavaScript',
        courseId: '1',
        tutor: 'Dr. Kamal Perera'
      }
    ];
    setLessons(mockLessons);
    filterLessonsByDate(mockLessons);
    setCourses([{ _id: '1', title: 'Advanced JavaScript' }]);
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

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const content = (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Schedule</h1>
          <p className="text-slate-500 mt-1">View all your upcoming lessons and classes</p>
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
        </div>
      </div>

      {/* Stats */}
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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
          <p className="text-2xl font-bold text-slate-500">
            {lessons.filter(l => new Date(l.date) <new Date()).length}
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
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full border-none"
                />
              </div>
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
                      <div key={lesson._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-1">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{lesson.courseTitle}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(lesson.date)}</span>
                          <span>•</span>
                          <span>{lesson.duration} min</span>
                        </div>
                        {lesson.meetingLink && (
                          <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                            Join Session <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No lessons scheduled for this day</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">All Upcoming Lessons</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {lessons.filter(l => new Date(l.date) >= new Date()).length === 0 ? (
                  <div className="p-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No upcoming lessons scheduled</p>
                  </div>
                ) : (
                  lessons.filter(l => new Date(l.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).map(lesson => (
                      <div key={lesson._id} className="p-6 hover:bg-slate-50 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Video className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">{lesson.title}</h3>
                              <p className="text-sm text-slate-500">{lesson.courseTitle}</p>
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
                              </div>
                            </div>
                          </div>
                          {lesson.meetingLink && (
                            <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                              Join Session
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return <StudentLayout title="Schedule">{content}</StudentLayout>;
};

export default StudentSchedule;

