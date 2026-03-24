// src/pages/TutorCourseCreate.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorCourseCreate = ({ onBack = () => {} }) => {  // ← default empty function
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    price: 0,
    thumbnail: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Programming', 'Web Development',
    'Database Systems', 'Networking', 'English Literature',
    'Economics', 'Business Studies', 'Accounting'
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => onBack(), 2000);
      } else {
        alert(data.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Created!</h2>
        <p className="text-slate-500">Your course has been published and is now visible to students.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Create New Course</h1>
          <p className="text-slate-500 mt-1">Set up a new course – you can add lessons later.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Course Title *</label>
            <input type="text" name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.title ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
              placeholder="e.g. Advanced JavaScript" />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Subject *</label>
            <select name="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.subject ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}>
              <option value="">Select a subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Description *</label>
            <textarea name="description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.description ? 'border-rose-300' : 'border-transparent focus:border-brand-500'}`}
              placeholder="What will students learn? What are the prerequisites?" />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Price (LKR)</label>
            <input type="number" name="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
              placeholder="0 for free" />
            <p className="text-[10px] text-slate-400 mt-1">Set to 0 for free courses.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Thumbnail URL (optional)</label>
            <input type="url" name="thumbnail" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
              placeholder="https://example.com/image.jpg" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 disabled:opacity-70 flex items-center justify-center gap-2">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div> : <Save className="h-5 w-5" />}
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TutorCourseCreate;