import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Megaphone } from 'lucide-react';
import StudentLayout from '../components/StudentLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const StudentAnnouncements = () => {
        const [notices, setNotices] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
            const fetchNotices = async() => {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token');

                try {
                    const response = await fetch(`${API_BASE_URL}/notices/student`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await response.json();

                    if (!data.success) {
                        throw new Error(data.message || 'Failed to load announcements');
                    }
                    setNotices(data.data || []);
                } catch (fetchError) {
                    setError(fetchError.message || 'Failed to load announcements');
                } finally {
                    setLoading(false);
                }
            };

            fetchNotices();
        }, []);

        const content = ( <
                div className = "max-w-5xl mx-auto space-y-6" >
                <
                div className = "bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" >
                <
                div className = "flex items-center gap-3 mb-2" >
                <
                Megaphone className = "h-5 w-5 text-indigo-600" / >
                <
                h1 className = "text-2xl font-bold text-slate-900" > Announcements < /h1> <
                /div> <
                p className = "text-sm text-slate-500" > Common notices are visible to all students.Module - wise notices are shown only
                for your enrolled modules. < /p> <
                /div>

                {
                    error && < p className = "text-sm text-rose-600 font-medium" > { error } < /p>}

                    {
                        loading ? ( <
                                div className = "flex justify-center py-16" >
                                <
                                div className = "w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" > < /div> <
                                /div>
                            ) : notices.length === 0 ? ( <
                                div className = "bg-white p-10 rounded-3xl border border-slate-100 text-center" >
                                <
                                Bell className = "h-10 w-10 text-slate-300 mx-auto mb-3" / >
                                <
                                p className = "text-slate-500" > No announcements available right now. < /p> <
                                /div>
                            ) : ( <
                                div className = "space-y-4" > {
                                    notices.map((notice, index) => ( <
                                            motion.div key = { notice._id }
                                            initial = {
                                                { opacity: 0, y: 12 } }
                                            animate = {
                                                { opacity: 1, y: 0 } }
                                            transition = {
                                                { delay: index * 0.04 } }
                                            className = "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" >
                                            <
                                            div className = "flex flex-wrap items-center gap-2 mb-2 text-xs" >
                                            <
                                            span className = { `px-2 py-1 rounded-full font-semibold ${notice.scope === 'common' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}` } > { notice.scope === 'common' ? 'Common' : 'Module' } <
                                            /span> {
                                                notice.course && < span className = "px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold" > { notice.course.title } < /span>} <
                                                    span className = "text-slate-400" > { new Date(notice.createdAt).toLocaleString() } < /span> <
                                                    /div> <
                                                    h2 className = "text-lg font-bold text-slate-900" > { notice.title } < /h2> <
                                                    p className = "text-sm text-slate-600 mt-2 whitespace-pre-line" > { notice.content } < /p> <
                                                    p className = "text-xs text-slate-400 mt-3" > Posted by { notice.createdBy ? .name || 'Tutor' } < /p> <
                                                    /motion.div>
                                            ))
                                    } <
                                    /div>
                                )
                            } <
                            /div>
                    );

                    return <StudentLayout title = "Announcements" > { content } < /StudentLayout>;
                };

                export default StudentAnnouncements;