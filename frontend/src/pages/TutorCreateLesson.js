import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Clock, Video, Users, Calendar as CalendarIcon,
  ChevronLeft, X, BookOpen, FileText, Link as LinkIcon,
  MapPin, Globe, Save, AlertCircle, CheckCircle, DollarSign
} from 'lucide-react';

const TutorCreateLesson = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '60',
    timezone: 'Asia/Colombo',
    meetingLink: '',
    meetingPassword: '',
    maxStudents: 20,
    lessonType: 'Group',
    price: 0,
    prerequisites: ''
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Lesson title is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.meetingLink) newErrors.meetingLink = 'Meeting link is required';
    
    if (formData.meetingLink && !formData.meetingLink.startsWith('http')) {
      newErrors.meetingLink = 'Meeting link must start with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        if (onSuccess) onSuccess(formData);
        if (onBack) onBack();
      }, 2000);
    }, 1500);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto shadow-2xl"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Lesson Created!</h2>
        <p className="text-slate-500">Your lesson has been successfully scheduled.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Create New Lesson</h1>
          <p className="text-slate-500 mt-1">Schedule a new class and set up meeting details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-500" />
              Basic Information
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Lesson Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced JavaScript: Closures & Scope"
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.title ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Subject <span className="text-rose-500">*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.subject ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                }`}
              >
                <option value="">Select a subject</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="What will students learn in this lesson? Include topics, objectives, and prerequisites..."
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all resize-none ${
                  errors.description ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                }`}
              />
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-500" />
              Schedule & Duration
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.date ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                  }`}
                />
                {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
                >
                  <option value="Asia/Colombo">Sri Lanka (GMT+5:30)</option>
                  <option value="Asia/Kolkata">India (GMT+5:30)</option>
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="America/New_York">New York (GMT-4)</option>
                  <option value="Europe/London">London (GMT+1)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Start Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.startTime ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                  }`}
                />
                {errors.startTime && <p className="text-xs text-rose-500 mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  End Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.endTime ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                  }`}
                />
                {errors.endTime && <p className="text-xs text-rose-500 mt-1">{errors.endTime}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Lesson Type
                </label>
                <div className="flex gap-3">
                  {['Group', 'One-on-One'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, lessonType: type})}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        formData.lessonType === type 
                          ? 'bg-brand-50 border-brand-500 text-brand-600' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Details */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-brand-500" />
              Meeting Details
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Meeting Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/123456789 or https://meet.google.com/xxx-xxxx-xxx"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.meetingLink ? 'border-rose-300 focus:border-rose-500' : 'border-transparent focus:border-brand-500'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Add Zoom, Google Meet, or Microsoft Teams link</p>
              {errors.meetingLink && <p className="text-xs text-rose-500 mt-1">{errors.meetingLink}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Meeting Password (Optional)
              </label>
              <input
                type="text"
                name="meetingPassword"
                value={formData.meetingPassword}
                onChange={handleChange}
                placeholder="Enter meeting password if required"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-500" />
              Additional Settings
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Maximum Students
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Price per Student (LKR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
                    step={100}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Set to 0 for free lessons</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Prerequisites (Optional)
              </label>
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Basic JavaScript knowledge, Completed HTML/CSS course"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="h-5 w-5" />
            )}
            {isSubmitting ? 'Creating...' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TutorCreateLesson;