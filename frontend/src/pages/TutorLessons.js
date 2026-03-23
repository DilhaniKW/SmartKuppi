import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Users, Clock, Calendar, 
  MoreVertical, CheckCircle, XCircle, 
  Plus, Search, Filter, ChevronLeft,
  ExternalLink, Play, MessageSquare, Link as LinkIcon
} from 'lucide-react';

const TutorLessons = ({ onBack }) => {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Advanced JavaScript Patterns', student: 'John Doe', date: '2024-03-25', time: '10:00 AM', duration: '60 min', students: 12, status: 'upcoming', type: 'Group', meetingLink: 'https://meet.google.com/xxx-xxxx-xxx' },
    { id: 2, title: 'React Performance Optimization', student: 'Sarah Smith', date: '2024-03-26', time: '02:00 PM', duration: '90 min', students: 1, status: 'upcoming', type: 'One-on-One', meetingLink: 'https://zoom.us/j/123456789' },
    { id: 3, title: 'Node.js Backend Architecture', student: 'Mike Johnson', date: '2024-03-24', time: '11:00 AM', duration: '60 min', students: 15, status: 'completed', type: 'Group', meetingLink: '' },
    { id: 4, title: 'Introduction to TypeScript', student: 'Emily Brown', date: '2024-03-27', time: '09:00 AM', duration: '45 min', students: 5, status: 'upcoming', type: 'Group', meetingLink: 'https://meet.google.com/yyy-yyyy-yyy' },
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lesson.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || lesson.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">Upcoming</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">Completed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Lessons</h1>
            <p className="text-slate-500 mt-1">Manage your scheduled sessions and teaching history.</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/tutor/create-lesson'}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
        >
          <Plus className="h-5 w-5" />
          <span>New Lesson</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lessons or students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-2xl focus:outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-2xl focus:outline-none transition-all text-sm font-medium text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <motion.div 
              key={lesson.id}
              layout
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <Video className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                      {getStatusBadge(lesson.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{lesson.student} {lesson.students > 1 ? `+ ${lesson.students - 1} others` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{new Date(lesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {lesson.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">{lesson.type}</span>
                      </div>
                    </div>
                    {lesson.meetingLink && (
                      <a 
                        href={lesson.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline mt-2"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Meeting Link
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 lg:text-right">
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-slate-900">{lesson.time}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(lesson.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {lesson.status === 'upcoming' && lesson.meetingLink && (
                      <a 
                        href={lesson.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/10 flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4 fill-current" /> Start Session
                      </a>
                    )}
                    <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No lessons found</h3>
            <p className="text-slate-500 mt-2">Adjust your filters or schedule a new lesson to get started.</p>
            <button 
              onClick={() => window.location.href = '/tutor/create-lesson'}
              className="mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all"
            >
              Schedule New Lesson
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TutorLessons;