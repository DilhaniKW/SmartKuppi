// src/pages/TutorLessonCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Users, BookOpen, Calendar, Bell, Clock, BarChart3,
  Plus, ArrowUpRight, Video, MessageSquare, DollarSign, 
  Settings, LogOut, Menu, X, FileText, Search, Star, AlertCircle,
  ChevronDown, Mail, Phone, Award, CheckCircle, XCircle, GraduationCap,
  FolderOpen, Inbox, Edit3, Upload, ExternalLink, MoreVertical,
  Save
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorLessonCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tutor, setTutor] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    meetingLink: '',
    meetingPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');

  // Check authentication
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'tutor') {
        navigate('/');
        return;
      }
      setTutor(parsedUser);
      fetchUnreadMessages(token);
    } catch (error) {
      console.error('Error:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchUnreadMessages = async (token) => {
    try {
      const inboxRes = await fetch(`${API_BASE_URL}/messages/inbox`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const inboxData = await inboxRes.json();
      if (inboxData.success) {
        const unread = inboxData.data.filter(m => !m.read).length;
        setUnreadMessages(unread);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  useEffect(() => {
    if (!courseId) {
      navigate('/tutor/courses');
      return;
    }
    // Fetch course title
    const fetchCourse = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setCourseTitle(data.data.title);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Lesson title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.meetingLink) newErrors.meetingLink = 'Meeting link is required';
    if (formData.meetingLink && !formData.meetingLink.startsWith('http')) {
      newErrors.meetingLink = 'Meeting link must start with http:// or https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    // Combine date and time into a single ISO string
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    if (isNaN(dateTime.getTime())) {
      setErrors({ ...errors, date: 'Invalid date/time' });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/lessons/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: dateTime.toISOString(),
          duration: parseInt(formData.duration),
          meetingLink: formData.meetingLink,
          meetingPassword: formData.meetingPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/tutor/courses/${courseId}`), 2000);
      } else {
        alert(data.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navLinks = [
    { name: 'Dashboard', icon: Layout, path: '/tutor-dashboard' },
    { name: 'My Courses', icon: FolderOpen, path: '/tutor/courses' },
    { name: 'Schedule', icon: Calendar, path: '/tutor/schedule' },
    { name: 'Create Course', icon: Plus, path: '/tutor/create-course' },
    { name: 'Messages', icon: MessageSquare, path: '/tutor/messages', badge: unreadMessages },
    { name: 'Resources', icon: FileText, path: '/tutor/resources' },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Lesson Created!</h2>
          <p className="text-slate-500">Your lesson has been added to the course.</p>
          <button onClick={() => navigate(`/tutor/courses/${courseId}`)} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Back to Course
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <Link to="/tutor-dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight">Smart<span className="text-indigo-400">Kuppi</span></span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Tutor Portal</span>
              </div>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X className="h-6 w-6" /></button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <p className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tutor Menu</p>
            {navLinks.map((link) => {
              const isActive = link.path === `/tutor/create-lesson` ? false : window.location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-left ${
                    isActive ? 'bg-indigo-600/10 text-indigo-600 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">{link.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all">
              <LogOut className="h-5 w-5" /><span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600">
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 w-64 lg:w-96">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search students, courses..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="relative">
              <button onClick={() => setProfileDropdown(!profileDropdown)} className="flex items-center space-x-3 p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">{tutor ? getInitials(tutor.name) : 'T'}</div>
                <span className="hidden md:block text-sm font-medium text-slate-700">{tutor?.name || 'Tutor'}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {profileDropdown && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-50"><p className="text-sm font-semibold text-slate-800">{tutor?.name}</p><p className="text-xs text-slate-500">{tutor?.email}</p></div>
                    <div className="p-1"><button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl"><Users className="h-4 w-4" /><span>My Profile</span></button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl"><Settings className="h-4 w-4" /><span>Account Settings</span></button></div>
                    <div className="p-1 border-t border-slate-50"><button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl"><LogOut className="h-4 w-4" /><span>Sign Out</span></button></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Add Lesson</h1>
                <p className="text-slate-500 mt-1">to {courseTitle || 'course'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Lesson Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.title ? 'border-rose-300' : 'border-transparent focus:border-indigo-500'}`}
                    placeholder="e.g. Introduction to JavaScript"
                  />
                  {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.description ? 'border-rose-300' : 'border-transparent focus:border-indigo-500'}`}
                    placeholder="What will students learn?"
                  />
                  {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.date ? 'border-rose-300' : 'border-transparent focus:border-indigo-500'}`}
                    />
                    {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Start Time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.time ? 'border-rose-300' : 'border-transparent focus:border-indigo-500'}`}
                    />
                    {errors.time && <p className="text-xs text-rose-500 mt-1">{errors.time}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Duration (minutes)</label>
                    <select
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl focus:outline-none transition-all"
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Meeting Link *</label>
                    <input
                      type="url"
                      value={formData.meetingLink}
                      onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
                      placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                      className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.meetingLink ? 'border-rose-300' : 'border-transparent focus:border-indigo-500'}`}
                    />
                    {errors.meetingLink && <p className="text-xs text-rose-500 mt-1">{errors.meetingLink}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Meeting Password (Optional)</label>
                  <input
                    type="text"
                    value={formData.meetingPassword}
                    onChange={e => setFormData({ ...formData, meetingPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl focus:outline-none transition-all"
                    placeholder="Enter password if required"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => navigate(`/tutor/courses/${courseId}`)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
                  {isSubmitting ? 'Creating...' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-100 py-6 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2"><BookOpen className="h-5 w-5 text-indigo-500" /><span className="font-bold text-slate-900">Smart<span className="text-indigo-500">Kuppi</span></span><span className="text-xs text-slate-400 ml-2">© 2024 Tutor Portal v1.2</span></div>
            <div className="flex items-center space-x-6 text-xs font-bold text-slate-400 uppercase tracking-widest"><button className="hover:text-indigo-500">Tutor Guide</button><button className="hover:text-indigo-500">Support</button><button className="hover:text-indigo-500">Privacy</button></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TutorLessonCreate;