// src/pages/StudentCourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Video, FileText, MessageSquare, Calendar, Clock, Download, Send } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons');
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Fetch course details
        const courseRes = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const courseData = await courseRes.json();
        if (courseData.success) setCourse(courseData.data);

        // Fetch lessons
        const lessonsRes = await fetch(`${API_BASE_URL}/lessons/courses/${courseId}/lessons`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const lessonsData = await lessonsRes.json();
        if (lessonsData.success) setLessons(lessonsData.data);

        // Fetch resources
        const resourcesRes = await fetch(`${API_BASE_URL}/resources/courses/${courseId}/resources`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resourcesData = await resourcesRes.json();
        if (resourcesData.success) setResources(resourcesData.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, navigate]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;
    setSending(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: course.tutor._id,
          course: course._id,
          content: messageContent
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Message sent to tutor!');
        setMessageContent('');
      } else {
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
          <p className="text-slate-500 mt-1">Instructor: {course.tutor?.name || 'Unknown'}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <p className="text-slate-600">{course.description}</p>
        </div>
        <div className="border-b border-slate-100">
          <div className="flex gap-2 p-2">
            {['lessons', 'resources', 'message'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {tab === 'lessons' && <><Video className="h-4 w-4 inline mr-2" />Lessons</>}
                {tab === 'resources' && <><FileText className="h-4 w-4 inline mr-2" />Resources</>}
                {tab === 'message' && <><MessageSquare className="h-4 w-4 inline mr-2" />Message Tutor</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'lessons' && (
            <div className="space-y-4">
              {lessons.length > 0 ? lessons.map(lesson => (
                <div key={lesson._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">{lesson.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(lesson.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(lesson.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.duration} min</span>
                      </div>
                    </div>
                    {lesson.meetingLink && new Date(lesson.date) > new Date() && (
                      <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-all">Join Session</a>
                    )}
                  </div>
                </div>
              )) : <p className="text-slate-500 text-center py-4">No lessons scheduled yet.</p>}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              {resources.length > 0 ? resources.map(res => (
                <div key={res._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{res.title}</h4>
                    <p className="text-xs text-slate-500">{res.fileType?.toUpperCase() || 'FILE'} • {res.downloads} downloads</p>
                  </div>
                  <a href={`${API_BASE_URL}${res.fileUrl}`} download className="p-2 text-slate-400 hover:text-brand-600 rounded-lg transition-colors">
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              )) : <p className="text-slate-500 text-center py-4">No resources yet.</p>}
            </div>
          )}

          {activeTab === 'message' && (
            <div className="space-y-4">
              <p className="text-slate-600">Have a question for {course.tutor?.name}? Send a message.</p>
              <textarea
                rows="4"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !messageContent.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all disabled:opacity-50"
              >
                {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="h-5 w-5" />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentCourseDetail;