// src/pages/TutorCourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
ChevronLeft, Video, FileText, Users, Plus, Calendar, 
Clock, Download, ExternalLink, MoreVertical, MessageSquare, 
Edit, Trash2, Upload 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons');
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

        // Fetch enrolled students
        const studentsRes = await fetch(`${API_BASE_URL}/enrollments/courses/${courseId}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const studentsData = await studentsRes.json();
        if (studentsData.success) setStudents(studentsData.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Course not found.</p>
        <button onClick={() => navigate('/tutor/courses')} className="mt-4 text-brand-600 hover:underline">
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tutor/courses')} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{course.title}</h1>
          <p className="text-slate-500 mt-1">{course.subject} • {course.enrolledCount || 0} students enrolled</p>
        </div>
            <div className="ml-auto flex gap-3">
            {/* Edit Course - secondary button */}
            <Link
                to={`/tutor/courses/${courseId}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
                <Edit className="h-4 w-4" />
                <span>Edit Course</span>
            </Link>

            {/* Add Lesson - primary button */}
            <Link
                to={`/tutor/create-lesson?course=${courseId}`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
                <Plus className="h-4 w-4" />
                <span>Add Lesson</span>
            </Link>

            {/* Upload Resource - secondary but with distinct color */}
            <Link
                to={`/tutor/upload-resource?course=${courseId}`}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
                <Upload className="h-4 w-4" />
                <span>Upload Resource</span>
            </Link>
            </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100">
          <div className="flex gap-2 p-2">
            {['lessons', 'resources', 'students'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {tab === 'lessons' && <><Video className="h-4 w-4 inline mr-2" />Lessons ({lessons.length})</>}
                {tab === 'resources' && <><FileText className="h-4 w-4 inline mr-2" />Resources ({resources.length})</>}
                {tab === 'students' && <><Users className="h-4 w-4 inline mr-2" />Students ({students.length})</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-4">
              {lessons.length > 0 ? (
                lessons.map(lesson => (
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
                      <div className="flex gap-2">
                        <a href={lesson.meetingLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-all">Join Session</a>
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreVertical className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No lessons yet. Click "Add Lesson" to create one.</p>
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {resources.length > 0 ? (
                resources.map(res => (
                  <div key={res._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{res.title}</h4>
                      <p className="text-xs text-slate-500">{res.fileType?.toUpperCase()} • {res.downloads} downloads</p>
                    </div>
                    <a href={`${API_BASE_URL}${res.fileUrl}`} download className="p-2 text-slate-400 hover:text-brand-600 rounded-lg transition-colors">
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No resources yet. You can upload materials later.</p>
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {students.length > 0 ? (
                students.map(enrollment => (
                  <div key={enrollment._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{enrollment.student?.name || 'Unknown'}</h4>
                      <p className="text-xs text-slate-500">{enrollment.student?.email || ''}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      <MessageSquare className="h-3 w-3 inline mr-1" /> Message
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No students enrolled yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TutorCourseDetail;