// src/pages/TutorMessages.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, User, BookOpen, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorMessages = ({ onBack = () => {} }) => {  // ← default empty function
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE_URL}/messages/inbox`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setMessages(data.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-slate-500 mt-1">Messages from students about your courses.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center"><Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500">No messages yet.</p></div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg._id} className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 transition-all hover:shadow-md ${!msg.read ? 'border-l-4 border-l-brand-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><User className="h-5 w-5" /></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{msg.sender?.name || 'Unknown'}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><BookOpen className="h-3 w-3" /> {msg.course?.title || 'Unknown course'}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="text-slate-600 mt-2">{msg.content}</p>
                  </div>
                </div>
                {!msg.read && <span className="px-2 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full">New</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TutorMessages;