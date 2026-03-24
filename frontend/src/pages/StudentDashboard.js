// src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Calendar, Bell, Search, ChevronRight, GraduationCap, 
  Clock, Award, PlayCircle, Download, Heart, MessageCircle, 
  TrendingUp, ArrowUpRight, Users, Compass
} from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedLessons: 0,
    resources: 0,
    achievementPoints: 0,
    learningStreak: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.id, token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardData = async (userId, token) => {
    setLoading(true);
    try {
      const coursesRes = await fetch(`${API_BASE_URL}/enrollments/students/${userId}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const coursesData = await coursesRes.json();
      if (coursesData.success) {
        setEnrolledCourses(coursesData.data);
        setStats(prev => ({ ...prev, enrolledCourses: coursesData.data.length }));
      }

      setTimeout(() => {
        setStats(prev => ({
          ...prev,
          completedLessons: 18,
          resources: 42,
          achievementPoints: 320,
          learningStreak: 12
        }));
        setUpcomingLessons([
          { id: 1, title: 'React Hooks Workshop', tutor: 'Ms. Nimali Silva', time: 'Today 2:00 PM', duration: '1.5 hours', subject: 'React.js', meetingLink: 'https://meet.google.com/xxx' }
        ]);
        setRecommendedResources([
          { id: 1, title: 'JS Interview Questions', type: 'PDF', author: 'Tech Community', likes: 234, downloads: 1200 }
        ]);
        setActivityFeed([
          { id: 1, type: 'resource', message: 'New resource: "React Hooks Guide"', time: '10m ago', icon: BookOpen, color: 'text-blue-500' }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMockData();
      setLoading(false);
    }
  };

  const setMockData = () => {
    setStats({
      enrolledCourses: 3,
      completedLessons: 18,
      resources: 42,
      achievementPoints: 320,
      learningStreak: 12
    });
    setEnrolledCourses([
      { _id: '1', title: 'Advanced JavaScript', tutor: { name: 'Dr. Kamal Perera' }, progress: 65, nextLesson: 'Closures & Scope', time: 'Tomorrow 10:00 AM', image: null },
      { _id: '2', title: 'React Masterclass', tutor: { name: 'Ms. Nimali Silva' }, progress: 40, nextLesson: 'Hooks Deep Dive', time: 'Today 2:00 PM', image: null }
    ]);
    setUpcomingLessons([
      { id: 1, title: 'React Hooks Workshop', tutor: 'Ms. Nimali Silva', time: 'Today 2:00 PM', duration: '1.5 hours', subject: 'React.js', meetingLink: 'https://meet.google.com/xxx' }
    ]);
    setRecommendedResources([
      { id: 1, title: 'JS Interview Questions', type: 'PDF', author: 'Tech Community', likes: 234, downloads: 1200 }
    ]);
    setActivityFeed([
      { id: 1, type: 'resource', message: 'New resource: "React Hooks Guide"', time: '10m ago', icon: BookOpen, color: 'text-blue-500' }
    ]);
  };

  const getFirstName = () => {
    if (!user || !user.name) return 'Student';
    return user.name.split(' ')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    { title: 'Enrolled Courses', value: stats.enrolledCourses, change: '+2 this sem', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Completed Lessons', value: stats.completedLessons, change: `${Math.round((stats.completedLessons / 40) * 100)}% complete`, icon: PlayCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Resources', value: stats.resources, change: '+12 new', icon: Download, color: 'text-violet-600', bg: 'bg-violet-50' },
    { title: 'Achievement Points', value: stats.achievementPoints, change: 'Top 15%', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const content = (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {getFirstName()}! 👋</h1>
          <p className="text-indigo-100 mt-2 max-w-md">You have {upcomingLessons.length} lessons scheduled for today. Your learning streak is {stats.learningStreak} days! Keep it up.</p>
          <div className="flex items-center space-x-4 mt-6">
            <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50">Continue Learning</button>
            <button className="px-6 py-2.5 bg-indigo-500/20 text-white border border-white/20 rounded-xl font-bold text-sm hover:bg-indigo-500/30">View Schedule</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 opacity-10"><GraduationCap className="w-64 h-64" /></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}><Icon className="h-6 w-6" /></div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My Courses</h2>
            <Link to="/courses" className="text-indigo-600 text-sm font-bold flex items-center">View All <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
          </div>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Link key={course._id} to={`/student/courses/${course._id}`} className="block">
                  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group border-b-4 border-b-indigo-600">
                    <div className="relative h-40 overflow-hidden">
                      <img src={course.thumbnail || 'https://picsum.photos/400/200'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-indigo-600 px-2 py-1 rounded">{course.tutor?.name || 'Tutor'}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{course.title}</h3>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400"><span>Progress</span><span>{course.progress || 0}%</span></div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress || 0}%` }} className="h-full bg-indigo-600 rounded-full"></motion.div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider"><Clock className="h-3 w-3 mr-1 text-indigo-600" /><span>Next: {course.nextLesson || 'No upcoming'}</span></div>
                        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
              <p className="text-slate-500">You haven't enrolled in any courses yet.</p>
              <Link to="/browse-courses" className="inline-block mt-4 text-indigo-600 font-bold hover:underline">Browse Available Courses</Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Learning Streak */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-slate-900">Learning Streak 🔥</h2><span className="text-indigo-600 font-bold text-sm">{stats.learningStreak} Days</span></div>
            <div className="flex items-end justify-between h-24 gap-2">
              {[40, 70, 45, 90, 65, 30, 80].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} className={`w-full rounded-t-lg ${i === 6 ? 'bg-indigo-600' : 'bg-slate-100'}`}></motion.div>
                  <span className="text-[10px] font-bold text-slate-400">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Today's Schedule</h2>
            {upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div><span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{lesson.subject}</span><h3 className="font-bold text-slate-900 mt-1 group-hover:text-indigo-600">{lesson.title}</h3><p className="text-xs text-slate-500 mt-1">with {lesson.tutor}</p></div>
                      <div className="p-2 bg-white text-slate-400 rounded-xl shadow-sm"><Calendar className="h-4 w-4" /></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-slate-500"><Clock className="h-3 w-3 mr-1 text-indigo-600" />{lesson.time}</div>
                      <button className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700">Join</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 text-center py-4">No lessons scheduled for today</p>}
          </div>

          {/* Recommended Resources */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Recommended</h2>
            {recommendedResources.length > 0 ? (
              <div className="space-y-4">
                {recommendedResources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600"><BookOpen className="h-4 w-4" /></div>
                      <div><p className="text-sm font-bold text-slate-900 leading-tight">{res.title}</p><div className="flex items-center space-x-2 mt-1"><span className="text-[10px] font-bold text-slate-400 uppercase">{res.type}</span><span className="text-[10px] text-slate-300">•</span><span className="flex items-center text-[10px] text-slate-400 font-bold"><Heart className="h-2.5 w-2.5 mr-0.5 text-rose-400" /> {res.likes}</span></div></div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Download className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 text-center py-4">No recommendations yet</p>}
            <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 border border-slate-100">Explore Library</button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          {activityFeed.length > 0 ? (
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {activityFeed.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start space-x-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center ${act.color} shadow-sm`}><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-slate-700 font-medium">{act.message}</p><p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{act.time}</p></div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-slate-500 text-center py-8">No recent activity</p>}
        </div>

        {/* Support Card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Need Help?</h3>
            <p className="text-slate-400 text-sm mt-2">Our support team and tutors are here to help you 24/7.</p>
            <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors text-left"><div className="flex items-center space-x-3"><MessageCircle className="h-4 w-4 text-indigo-400" /><span className="text-sm font-medium">Chat with Support</span></div><ChevronRight className="h-4 w-4 text-slate-500" /></button>
              <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors text-left"><div className="flex items-center space-x-3"><Users className="h-4 w-4 text-emerald-400" /><span className="text-sm font-medium">Study Groups</span></div><ChevronRight className="h-4 w-4 text-slate-500" /></button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10"><TrendingUp className="w-48 h-48" /></div>
        </div>
      </div>
    </div>
  );

  return <StudentLayout title="Dashboard">{content}</StudentLayout>;
};

export default StudentDashboard;