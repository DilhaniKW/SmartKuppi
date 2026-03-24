// src/pages/StudentCourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, FileText, MessageSquare, Calendar, Clock, Download, User, CheckCircle } from 'lucide-react';
import MessageThread from '../components/MessageThread';
import StudentLayout from '../components/StudentLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons');
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

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
        else throw new Error('Course not found');

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

  // Fetch conversation when message tab is opened
  useEffect(() => {
    if (course && activeTab === 'message') {
      fetchConversation();
    }
  }, [course, activeTab]);

  const fetchConversation = async () => {
    setLoadingMessages(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/messages?course=${course._id}&user=${course.tutor._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversation({
          otherUser: course.tutor,
          course: course,
          messages: data.data
        });
      } else {
        // Create empty conversation if none exists
        setConversation({
          otherUser: course.tutor,
          course: course,
          messages: []
        });
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleMessageSent = () => {
    fetchConversation();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Course not found.</p>
        <button onClick={() => navigate('/courses')} className="mt-4 text-indigo-600 hover:underline">
          Back to My Courses
        </button>
      </div>
    );
  }

  const content = (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
        <p className="text-slate-500 mt-1">Instructor: {course.tutor?.name || 'Unknown'}</p>
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
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {tab === 'lessons' && <><Video className="h-4 w-4 inline mr-2" />Lessons ({lessons.length})</>}
                {tab === 'resources' && <><FileText className="h-4 w-4 inline mr-2" />Resources ({resources.length})</>}
                {tab === 'message' && <><MessageSquare className="h-4 w-4 inline mr-2" />Message Tutor</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Lessons Tab */}
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
                      <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all">Join Session</a>
                    )}
                  </div>
                </div>
              )) : <p className="text-slate-500 text-center py-4">No lessons scheduled yet.</p>}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {resources.length > 0 ? resources.map(res => (
                <div key={res._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{res.title}</h4>
                    <p className="text-xs text-slate-500">{res.fileType?.toUpperCase() || 'FILE'} • {res.downloads} downloads</p>
                  </div>
                  <a href={`${API_BASE_URL}${res.fileUrl}`} download className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors">
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              )) : <p className="text-slate-500 text-center py-4">No resources yet.</p>}
            </div>
          )}

          {/* Message Tab */}
          {activeTab === 'message' && (
            <div className="min-h-[500px]">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <MessageThread 
                  conversation={conversation || {
                    otherUser: course.tutor,
                    course: course,
                    messages: []
                  }}
                  onMessageSent={handleMessageSent}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <StudentLayout title={course.title}>{content}</StudentLayout>;
};

export default StudentCourseDetail;