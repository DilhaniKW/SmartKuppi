import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save, Trash2, Edit3, Megaphone } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const initialForm = {
    title: '',
    content: '',
    scope: 'common',
    courseId: ''
};

const TutorAnnouncements = () => {
        const [notices, setNotices] = useState([]);
        const [courses, setCourses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [form, setForm] = useState(initialForm);
        const [error, setError] = useState('');

        const token = useMemo(() => localStorage.getItem('token'), []);

        const headers = useMemo(
            () => ({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }), [token]
        );

        const trimmedTitle = form.title.trim();
        const isTitleTooShort = trimmedTitle.length > 0 && trimmedTitle.length <= 3;
        const isCourseInvalid = form.scope === 'course' && !form.courseId;
        const isSubmitDisabled = saving || isTitleTooShort || isCourseInvalid;

        const loadData = async() => {
            setLoading(true);
            setError('');
            try {
                const [noticesRes, coursesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/notices/my`, { headers }),
                    fetch(`${API_BASE_URL}/courses/tutor/courses`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const [noticesData, coursesData] = await Promise.all([noticesRes.json(), coursesRes.json()]);

                if (noticesData.success) setNotices(noticesData.data);
                if (coursesData.success) setCourses(coursesData.data);
            } catch (loadError) {
                setError('Failed to load announcements');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            loadData();
        }, []);

        const handleChange = (event) => {
            const { name, value } = event.target;
            setForm((prev) => ({...prev, [name]: value }));
        };

        const resetForm = () => {
            setForm(initialForm);
            setEditingId(null);
        };

        const handleEdit = (notice) => {
            setEditingId(notice._id);
            setForm({
                title: notice.title || '',
                content: notice.content || '',
                scope: notice.scope || 'common',
                courseId: notice.course ? ._id || ''
            });
        };

        const handleSubmit = async(event) => {
            event.preventDefault();

            if (isTitleTooShort) {
                setError('Announcement title must be greater than 3 letters');
                return;
            }

            setSaving(true);
            setError('');

            try {
                const payload = {
                    title: form.title,
                    content: form.content,
                    scope: form.scope,
                    courseId: form.scope === 'course' ? form.courseId : undefined
                };

                const url = editingId ? `${API_BASE_URL}/notices/${editingId}` : `${API_BASE_URL}/notices`;
                const method = editingId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Failed to save announcement');
                }

                resetForm();
                await loadData();
            } catch (submitError) {
                setError(submitError.message || 'Failed to save announcement');
            } finally {
                setSaving(false);
            }
        };

        const handleDelete = async(id) => {
            const confirmed = window.confirm('Delete this announcement?');
            if (!confirmed) return;

            try {
                const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Failed to delete announcement');
                }
                await loadData();
            } catch (deleteError) {
                setError(deleteError.message || 'Failed to delete announcement');
            }
        };

        return ( <
                motion.div initial = {
                    { opacity: 0, y: 16 } }
                animate = {
                    { opacity: 1, y: 0 } }
                className = "max-w-7xl mx-auto space-y-8" >
                <
                div className = "bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" >
                <
                div className = "flex items-center gap-3 mb-4" >
                <
                Megaphone className = "h-5 w-5 text-indigo-600" / >
                <
                h2 className = "text-xl font-bold text-slate-900" > Create Announcement < /h2> <
                /div>

                {
                    error && < p className = "mb-3 text-sm text-rose-600 font-medium" > { error } < /p>}

                    <
                    form onSubmit = { handleSubmit }
                    className = "space-y-4" >
                        <
                        input
                    type = "text"
                    name = "title"
                    value = { form.title }
                    onChange = { handleChange }
                    required
                    placeholder = "Announcement title"
                    className = { `w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-indigo-500 ${
              isTitleTooShort ? 'border-rose-400' : 'border-slate-200'
            }` }
                    /> {
                        isTitleTooShort && ( <
                            p className = "text-sm text-rose-600 font-medium" > Title must be greater than 3 letters. < /p>
                        )
                    }

                    <
                    textarea
                    name = "content"
                    value = { form.content }
                    onChange = { handleChange }
                    required
                    rows = { 4 }
                    placeholder = "Write your announcement..."
                    className = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none" /
                        >

                        <
                        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                        <
                        select
                    name = "scope"
                    value = { form.scope }
                    onChange = { handleChange }
                    className = "px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" >
                        <
                        option value = "common" > Common(all students) < /option> <
                        option value = "course" > Module - wise(specific course) < /option> <
                        /select>

                    {
                        form.scope === 'course' ? ( <
                            select name = "courseId"
                            value = { form.courseId }
                            onChange = { handleChange }
                            required className = "px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500" >
                            <
                            option value = "" > Select course < /option> {
                                courses.map((course) => ( <
                                    option key = { course._id }
                                    value = { course._id } > { course.title } <
                                    /option>
                                ))
                            } <
                            /select>
                        ) : ( <
                            div className = "px-4 py-3 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 flex items-center" >
                            Visible to all students <
                            /div>
                        )
                    } <
                    /div>

                    <
                    div className = "flex items-center gap-3" >
                        <
                        button
                    type = "submit"
                    disabled = { isSubmitDisabled }
                    className = "inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60" >
                        <
                        Save className = "h-4 w-4" / > { editingId ? 'Update' : 'Publish' } <
                        /button> {
                            editingId && ( <
                                button type = "button"
                                onClick = { resetForm }
                                className = "px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold" >
                                Cancel Edit <
                                /button>
                            )
                        } <
                        /div> <
                        /form> <
                        /div>

                    <
                    div className = "bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" >
                        <
                        div className = "flex items-center gap-3 mb-4" >
                        <
                        Bell className = "h-5 w-5 text-indigo-600" / >
                        <
                        h2 className = "text-xl font-bold text-slate-900" > My Announcements < /h2> <
                        /div>

                    {
                        loading ? ( <
                                div className = "flex justify-center py-10" >
                                <
                                div className = "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" > < /div> <
                                /div>
                            ) : notices.length === 0 ? ( <
                                p className = "text-slate-500 text-sm" > No announcements yet. < /p>
                            ) : ( <
                                div className = "space-y-4" > {
                                    notices.map((notice) => ( <
                                            div key = { notice._id }
                                            className = "border border-slate-100 rounded-2xl p-4" >
                                            <
                                            div className = "flex items-start justify-between gap-3" >
                                            <
                                            div >
                                            <
                                            h3 className = "font-bold text-slate-900" > { notice.title } < /h3> <
                                            p className = "text-sm text-slate-500 mt-1" > { notice.content } < /p> <
                                            div className = "mt-2 flex flex-wrap items-center gap-2 text-xs" >
                                            <
                                            span className = { `px-2 py-1 rounded-full font-semibold ${notice.scope === 'common' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}` } > { notice.scope === 'common' ? 'Common' : 'Module' } <
                                            /span> {
                                                notice.course && < span className = "px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold" > { notice.course.title } < /span>} <
                                                    span className = "text-slate-400" > { new Date(notice.createdAt).toLocaleString() } < /span> <
                                                    /div> <
                                                    /div> <
                                                    div className = "flex items-center gap-2" >
                                                    <
                                                    button
                                                onClick = {
                                                    () => handleEdit(notice) }
                                                className = "p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                title = "Edit" >
                                                    <
                                                    Edit3 className = "h-4 w-4" / >
                                                    <
                                                    /button> <
                                                    button
                                                onClick = {
                                                    () => handleDelete(notice._id) }
                                                className = "p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                                                title = "Delete" >
                                                    <
                                                    Trash2 className = "h-4 w-4" / >
                                                    <
                                                    /button> <
                                                    /div> <
                                                    /div> <
                                                    /div>
                                            ))
                                    } <
                                    /div>
                                )
                            } <
                            /div> <
                            /motion.div>
                    );
                };

                export default TutorAnnouncements;