// src/pages/DiscussionForum.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentLayout from '../components/StudentLayout';
import { ChevronLeft, MessageCircle, ThumbsUp, Send, User, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const DiscussionForum = ({ onBack }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const trimmedTitle = newDiscussion.title.trim();
  const trimmedContent = newDiscussion.content.trim();
  const isTitleOnlySpaces = newDiscussion.title.length > 0 && trimmedTitle.length === 0;
  const isContentOnlySpaces = newDiscussion.content.length > 0 && trimmedContent.length === 0;
  const isTitleTooShort = trimmedTitle.length > 0 && trimmedTitle.length <= 3;
  const isSubmitDisabled = submitting || !trimmedTitle || !trimmedContent || isTitleTooShort;

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // This would be a real endpoint – for now we'll use mock data
      setTimeout(() => {
        setDiscussions([
          { id: 1, title: 'JavaScript Closure Explanation', content: 'Can someone explain closures with an example?', author: 'John Doe', date: '2024-03-23', replies: 3, likes: 5 },
          { id: 2, title: 'React Hooks Best Practices', content: 'What are the best practices for using useEffect?', author: 'Jane Smith', date: '2024-03-22', replies: 2, likes: 8 },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    setError('');

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content cannot be empty or only spaces');
      return;
    }

    if (isTitleTooShort) {
      setError('Discussion title must be greater than 3 letters');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setDiscussions([{
        id: Date.now(),
        title: trimmedTitle,
        content: trimmedContent,
        author: 'You',
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        likes: 0
      }, ...discussions]);
      setNewDiscussion({ title: '', content: '' });
      setSubmitting(false);
    }, 500);
  };

  // Create the content JSX
  const content = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Discussion Forum</h1>
        <p className="text-slate-500 mt-1">Ask questions, share knowledge, and connect with fellow students.</p>
      </div>

      {/* Create Discussion Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Start a Discussion</h2>
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}
          <input
            type="text"
            placeholder="Discussion title"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
            className={`w-full px-4 py-3 bg-slate-50 border-2 focus:outline-none rounded-xl transition-all ${
              isTitleTooShort ? 'border-rose-400' : 'border-transparent focus:border-indigo-500'
            }`}
          />
          {isTitleOnlySpaces && (
            <p className="text-sm text-rose-600 font-medium">Title cannot be only spaces.</p>
          )}
          {isTitleTooShort && (
            <p className="text-sm text-rose-600 font-medium">Title must be greater than 3 letters.</p>
          )}
          <textarea
            rows={4}
            placeholder="What would you like to discuss?"
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl focus:outline-none transition-all resize-none"
          />
          {isContentOnlySpaces && (
            <p className="text-sm text-rose-600 font-medium">Content cannot be only spaces.</p>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70"
          >
            {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="h-5 w-5" />}
            {submitting ? 'Posting...' : 'Post Discussion'}
          </button>
        </form>
      </div>

      {/* Discussions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map(discussion => (
            <div key={discussion.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{discussion.title}</h3>
                  <p className="text-slate-600 mb-4">{discussion.content}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {discussion.author}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {discussion.date}</span>
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <MessageCircle className="h-4 w-4" /> {discussion.replies} replies
                    </button>
                    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" /> {discussion.likes}
                    </button>
                  </div>
                </div>
                <button className="px-4 py-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-xl transition-colors">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  // Wrap the content with StudentLayout and return
  return <StudentLayout title="Discussions">{content}</StudentLayout>;
};

export default DiscussionForum;