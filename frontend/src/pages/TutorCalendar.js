import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import {
    Plus,
    Clock,
    Video,
    Users,
    ChevronLeft,
    X,
    CheckCircle,
    Calendar as CalendarIcon,
    MoreVertical,
    MessageSquare,
    ExternalLink
} from 'lucide-react';

const TutorCalendar = ({ onBack, onScheduleLesson }) => {
    const [date, setDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showLessonDetails, setShowLessonDetails] = useState(false);
    const [newLesson, setNewLesson] = useState({
        title: '',
        student: '',
        time: '10:00',
        duration: '60',
        type: 'One-on-One',
        meetingLink: ''
    });

    const [lessons, setLessons] = useState([
        { id: 1, title: 'Advanced JavaScript', student: 'John Doe', date: new Date().toISOString().split('T')[0], time: '10:00 AM', duration: '60 min', status: 'confirmed', meetingLink: 'https://meet.google.com/xxx-xxxx-xxx' },
        { id: 2, title: 'React Hooks Workshop', student: 'Sarah Smith', date: new Date().toISOString().split('T')[0], time: '02:00 PM', duration: '90 min', status: 'confirmed', meetingLink: 'https://zoom.us/j/123456789' },
        { id: 3, title: 'Database Design', student: 'Mike Johnson', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '11:00 AM', duration: '60 min', status: 'pending', meetingLink: '' },
    ]);

    const selectedDayLessons = lessons.filter(lesson =>
        isSameDay(parseISO(lesson.date), date)
    );

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasLesson = lessons.some(lesson => isSameDay(parseISO(lesson.date), date));
            if (hasLesson) {
                return <div className = "w-1.5 h-1.5 bg-brand-500 rounded-full mx-auto mt-1" > < /div>;
            }
        }
        return null;
    };

    const handleAddLesson = (e) => {
        e.preventDefault();
        const lesson = {
            id: Date.now(),
            ...newLesson,
            date: format(date, 'yyyy-MM-dd'),
            time: format(parseISO(`2024-01-01T${newLesson.time}`), 'hh:mm a'),
            duration: `${newLesson.duration} min`,
            status: 'confirmed',
            meetingLink: newLesson.meetingLink || ''
        };
        setLessons([...lessons, lesson]);
        setShowAddModal(false);
        setNewLesson({ title: '', student: '', time: '10:00', duration: '60', type: 'One-on-One', meetingLink: '' });
        if (onScheduleLesson) onScheduleLesson(lesson);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <span className = "px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full" > Confirmed < /span>;
            case 'pending':
                return <span className = "px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full" > Pending < /span>;
            default:
                return null;
        }
    };

    return ( <
        motion.div initial = {
            { opacity: 0, y: 20 } }
        animate = {
            { opacity: 1, y: 0 } }
        className = "max-w-7xl mx-auto space-y-8" >
        { /* Header */ } <
        div className = "flex flex-col md:flex-row md:items-center justify-between gap-4" >
        <
        div className = "flex items-center gap-4" >
        <
        button onClick = { onBack }
        className = "p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500" >
        <
        ChevronLeft className = "h-5 w-5" / >
        <
        /button> <
        div >
        <
        h1 className = "text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight" > Schedule Calendar < /h1> <
        p className = "text-slate-500 mt-1" > Plan and manage your teaching schedule. < /p> <
        /div> <
        /div> <
        button onClick = {
            () => setShowAddModal(true) }
        className = "flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20" >
        <
        Plus className = "h-5 w-5" / >
        <
        span > Quick Schedule < /span> <
        /button> <
        /div>

        <
        div className = "grid grid-cols-1 lg:grid-cols-3 gap-8" > { /* Calendar Card */ } <
        div className = "lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden" >
        <
        div className = "calendar-container custom-calendar" >
        <
        Calendar onChange = { setDate }
        value = { date }
        tileContent = { tileContent }
        className = "w-full border-none font-sans"
        next2Label = { null }
        prev2Label = { null }
        /> <
        /div>

        <
        style > { `
            .custom-calendar .react-calendar {
              width: 100%;
              border: none;
              font-family: inherit;
            }
            .custom-calendar .react-calendar__navigation {
              margin-bottom: 2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .custom-calendar .react-calendar__navigation button {
              min-width: 44px;
              background: none;
              font-size: 1.125rem;
              font-weight: 700;
              color: #0f172a;
              border-radius: 12px;
              padding: 8px;
              transition: all 0.2s;
            }
            .custom-calendar .react-calendar__navigation button:hover {
              background-color: #f8fafc;
            }
            .custom-calendar .react-calendar__month-view__weekdays {
              text-transform: uppercase;
              font-weight: 700;
              font-size: 0.75rem;
              color: #94a3b8;
              letter-spacing: 0.05em;
              margin-bottom: 1rem;
            }
            .custom-calendar .react-calendar__month-view__days__day {
              padding: 1rem 0;
              font-weight: 600;
              color: #475569;
              border-radius: 16px;
              transition: all 0.2s;
            }
            .custom-calendar .react-calendar__month-view__days__day:hover {
              background-color: #f1f5f9;
            }
            .custom-calendar .react-calendar__tile--now {
              background: #eff6ff;
              color: #2563eb;
            }
            .custom-calendar .react-calendar__tile--active {
              background: #2563eb !important;
              color: white !important;
              box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
            }
            .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
              color: #cbd5e1;
            }
          ` } < /style> <
        /div>

        { /* Selected Day Lessons */ } <
        div className = "space-y-6" >
        <
        div className = "bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" >
        <
        div className = "flex items-center justify-between mb-6" >
        <
        div className = "flex items-center space-x-2" >
        <
        CalendarIcon className = "h-5 w-5 text-brand-500" / >
        <
        h3 className = "font-bold text-slate-900" > { format(date, 'MMMM d, yyyy') } < /h3> <
        /div> <
        span className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest" > { selectedDayLessons.length }
        Lessons <
        /span> <
        /div>

        <
        div className = "space-y-4" > {
            selectedDayLessons.length > 0 ? (
                selectedDayLessons.map((lesson) => ( <
                    div key = { lesson.id }
                    className = "p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-pointer"
                    onClick = {
                        () => {
                            setSelectedLesson(lesson);
                            setShowLessonDetails(true);
                        }
                    } >
                    <
                    div className = "flex items-start justify-between mb-3" >
                    <
                    div className = "p-2 bg-white rounded-xl text-brand-600 shadow-sm" >
                    <
                    Video className = "h-4 w-4" / >
                    <
                    /div> { getStatusBadge(lesson.status) } <
                    /div> <
                    h4 className = "font-bold text-slate-900 group-hover:text-brand-600 transition-colors" > { lesson.title } < /h4> <
                    p className = "text-xs text-slate-500 mt-1 flex items-center gap-1.5" >
                    <
                    Users className = "h-3 w-3" / > { lesson.student } <
                    /p> <
                    div className = "flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50" >
                    <
                    div className = "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest" >
                    <
                    Clock className = "h-3 w-3" / > { lesson.time } <
                    /div> {
                        lesson.meetingLink && ( <
                            a href = { lesson.meetingLink }
                            target = "_blank"
                            rel = "noopener noreferrer"
                            className = "text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
                            onClick = {
                                (e) => e.stopPropagation() } >
                            Join < ExternalLink className = "h-3 w-3" / >
                            <
                            /a>
                        )
                    } <
                    /div> <
                    /div>
                ))
            ) : ( <
                div className = "py-12 text-center" >
                <
                div className = "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4" >
                <
                CalendarIcon className = "h-8 w-8 text-slate-200" / >
                <
                /div> <
                p className = "text-slate-500 text-sm font-medium" > No lessons scheduled < /p> <
                button onClick = {
                    () => setShowAddModal(true) }
                className = "mt-4 text-brand-600 text-sm font-bold hover:underline" >
                Schedule one now <
                /button> <
                /div>
            )
        } <
        /div> <
        /div>

        { /* Quick Stats Widget */ } <
        div className = "bg-slate-900 p-6 rounded-3xl text-white" >
        <
        h4 className = "font-bold mb-4" > Weekly Overview < /h4> <
        div className = "space-y-4" >
        <
        div className = "flex items-center justify-between" >
        <
        span className = "text-sm text-slate-400" > Total Hours < /span> <
        span className = "text-sm font-bold" > { lessons.reduce((total, l) => total + parseInt(l.duration), 0) / 60 }
        hrs <
        /span> <
        /div> <
        div className = "flex items-center justify-between" >
        <
        span className = "text-sm text-slate-400" > Completed Lessons < /span> <
        span className = "text-sm font-bold" > { lessons.filter(l => l.status === 'confirmed').length } < /span> <
        /div> <
        div className = "flex items-center justify-between" >
        <
        span className = "text-sm text-slate-400" > Upcoming Lessons < /span> <
        span className = "text-sm font-bold" > { lessons.filter(l => new Date(l.date) > new Date()).length } < /span> <
        /div> <
        /div> <
        /div> <
        /div> <
        /div>

        { /* Add Lesson Modal */ } <
        AnimatePresence > {
            showAddModal && ( <
                div className = "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" >
                <
                motion.div initial = {
                    { scale: 0.95, opacity: 0, y: 20 } }
                animate = {
                    { scale: 1, opacity: 1, y: 0 } }
                exit = {
                    { scale: 0.95, opacity: 0, y: 20 } }
                className = "bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" >
                <
                div className = "p-6 border-b border-slate-50 flex items-center justify-between" >
                <
                h3 className = "text-xl font-bold text-slate-900" > Quick Schedule < /h3> <
                button onClick = {
                    () => setShowAddModal(false) }
                className = "p-2 hover:bg-slate-50 rounded-xl transition-colors" >
                <
                X className = "h-5 w-5 text-slate-400" / >
                <
                /button> <
                /div> <
                form onSubmit = { handleAddLesson }
                className = "p-6 space-y-4" >
                <
                div >
                <
                label className = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" > Lesson Title < /label> <
                input type = "text"
                required value = { newLesson.title }
                onChange = { e => setNewLesson({...newLesson, title: e.target.value }) }
                placeholder = "e.g. Advanced JavaScript"
                className = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all text-sm" /
                >
                <
                /div> <
                div >
                <
                label className = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" > Student Name < /label> <
                input type = "text"
                required value = { newLesson.student }
                onChange = { e => setNewLesson({...newLesson, student: e.target.value }) }
                placeholder = "e.g. John Doe"
                className = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all text-sm" /
                >
                <
                /div> <
                div >
                <
                label className = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" > Meeting Link < /label> <
                input type = "url"
                value = { newLesson.meetingLink }
                onChange = { e => setNewLesson({...newLesson, meetingLink: e.target.value }) }
                placeholder = "https://zoom.us/j/... or https://meet.google.com/..."
                className = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all text-sm" /
                >
                <
                /div> <
                div className = "grid grid-cols-2 gap-4" >
                <
                div >
                <
                label className = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" > Start Time < /label> <
                input type = "time"
                required value = { newLesson.time }
                onChange = { e => setNewLesson({...newLesson, time: e.target.value }) }
                className = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all text-sm" /
                >
                <
                /div> <
                div >
                <
                label className = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" > Duration(min) < /label> <
                select value = { newLesson.duration }
                onChange = { e => setNewLesson({...newLesson, duration: e.target.value }) }
                className = "w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-brand-500 rounded-xl focus:outline-none transition-all text-sm font-medium" >
                <
                option value = "30" > 30 min < /option> <
                option value = "45" > 45 min < /option> <
                option value = "60" > 60 min < /option> <
                option value = "90" > 90 min < /option> <
                option value = "120" > 120 min < /option> <
                /select> <
                /div> <
                /div> <
                div className = "pt-4" >
                <
                button type = "submit"
                className = "w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20" >
                Schedule Lesson <
                /button> <
                /div> <
                /form> <
                /motion.div> <
                /div>
            )
        } <
        /AnimatePresence>

        { /* Lesson Details Modal */ } <
        AnimatePresence > {
            showLessonDetails && selectedLesson && ( <
                div className = "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" >
                <
                motion.div initial = {
                    { scale: 0.95, opacity: 0, y: 20 } }
                animate = {
                    { scale: 1, opacity: 1, y: 0 } }
                exit = {
                    { scale: 0.95, opacity: 0, y: 20 } }
                className = "bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" >
                <
                div className = "p-6 border-b border-slate-50 flex items-center justify-between" >
                <
                h3 className = "text-xl font-bold text-slate-900" > Lesson Details < /h3> <
                button onClick = {
                    () => setShowLessonDetails(false) }
                className = "p-2 hover:bg-slate-50 rounded-xl transition-colors" >
                <
                X className = "h-5 w-5 text-slate-400" / >
                <
                /button> <
                /div> <
                div className = "p-6 space-y-4" >
                <
                div >
                <
                p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Title < /p> <
                p className = "text-slate-900 font-bold" > { selectedLesson.title } < /p> <
                /div> <
                div >
                <
                p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Student < /p> <
                p className = "text-slate-600" > { selectedLesson.student } < /p> <
                /div> <
                div className = "grid grid-cols-2 gap-4" >
                <
                div >
                <
                p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Date < /p> <
                p className = "text-slate-600" > { selectedLesson.date } < /p> <
                /div> <
                div >
                <
                p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Time < /p> <
                p className = "text-slate-600" > { selectedLesson.time } < /p> <
                /div> <
                /div> <
                div >
                <
                p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Duration < /p> <
                p className = "text-slate-600" > { selectedLesson.duration } < /p> <
                /div> {
                    selectedLesson.meetingLink && ( <
                        div >
                        <
                        p className = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1" > Meeting Link < /p> <
                        a href = { selectedLesson.meetingLink }
                        target = "_blank"
                        rel = "noopener noreferrer"
                        className = "text-brand-600 font-medium text-sm hover:underline break-all" >
                        { selectedLesson.meetingLink } <
                        /a> <
                        /div>
                    )
                } <
                div className = "pt-4" >
                <
                button onClick = {
                    () => setShowLessonDetails(false) }
                className = "w-full py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all" >
                Close <
                /button> <
                /div> <
                /div> <
                /motion.div> <
                /div>
            )
        } <
        /AnimatePresence> <
        /motion.div>
    );
};

export default TutorCalendar;