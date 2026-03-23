// src/pages/TutorLessonCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, X, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorLessonCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');

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

  useEffect(() => {
    if (!courseId) {
      navigate('/tutor/courses');
      return;
    }
    // Fetch course title (optional)
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

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Lesson Created!</h2>
        <p className="text-slate-500">Your lesson has been added to the course.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(`/tutor/courses/${courseId}`)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
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
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.title ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
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
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.description ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
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
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.date ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Start Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.time ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
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
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
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
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.meetingLink ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
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
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
              placeholder="Enter password if required"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate(`/tutor/courses/${courseId}`)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 disabled:opacity-70 flex items-center justify-center gap-2">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
            {isSubmitting ? 'Creating...' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TutorLessonCreate;