import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, User, BookOpen, MessageSquare } from 'lucide-react';
import MessageThread from '../components/MessageThread';

const API_BASE_URL = 'http://localhost:5000/api';

const TutorMessages = ({ onBack }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Use a Ref to keep track of the selected ID without re-triggering the fetch function
  const selectedIdRef = useRef(null);

  const fetchMessages = useCallback(async (isBackground = false) => {
    // Only show the spinner on the very first load
    if (!isBackground) setLoading(true);
    
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    try {
      const [inboxRes, sentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/messages/inbox`, { 
          headers: { Authorization: `Bearer ${token}` } 
        }),
        fetch(`${API_BASE_URL}/messages/sent`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ]);
      
      const inboxData = await inboxRes.json();
      const sentData = await sentRes.json();
      
      let allMessages = [];
      if (inboxData.success) allMessages.push(...inboxData.data);
      if (sentData.success) allMessages.push(...sentData.data);
      
      const grouped = {};
      allMessages.forEach(msg => {
        const otherUser = msg.sender._id === currentUser.id ? msg.receiver : msg.sender;
        const courseId = msg.course?._id || msg.course || 'general'; 
        const key = `${otherUser._id}-${courseId}`;
        
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            otherUser,
            course: msg.course,
            messages: [],
            unreadCount: 0
          };
        }
        grouped[key].messages.push(msg);
        if (!msg.read && msg.receiver._id === currentUser.id) grouped[key].unreadCount++;
      });
      
      const convList = Object.values(grouped).map(conv => ({
        ...conv,
        messages: conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
        lastMessage: conv.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[conv.messages.length - 1]
      })).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
      
      setConversations(convList);

      // If a conversation is already open, update its data in the UI
      if (selectedIdRef.current) {
        const updated = convList.find(c => c.id === selectedIdRef.current);
        if (updated) setSelectedConversation(updated);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies = function is stable and won't re-run on click

  // Initial fetch only
  useEffect(() => { 
    fetchMessages(); 
  }, [fetchMessages]);

  const handleSelect = (conv) => {
    selectedIdRef.current = conv.id; // Store ID in ref
    setSelectedConversation(conv);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diff = (new Date() - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white border rounded-xl transition-all text-slate-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Tutor Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Conversations</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loading && conversations.length === 0 ? (
               <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : conversations.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No messages found.</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-all ${selectedConversation?.id === conv.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><User className="text-slate-500" size={20}/></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-900 truncate">{conv.otherUser.name}</p>
                        <span className="text-[10px] text-slate-400">{formatDate(conv.lastMessage.createdAt)}</span>
                      </div>
                      <p className="text-xs text-indigo-600 truncate flex items-center gap-1"><BookOpen size={12}/> {conv.course?.title}</p>
                      <p className="text-sm text-slate-500 truncate mt-1">{conv.lastMessage.content}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[600px]">
          {selectedConversation ? (
            <MessageThread 
              conversation={selectedConversation} 
              onMessageSent={() => fetchMessages(true)} // Background refresh (no spinner)
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <MessageSquare size={64} className="opacity-20 mb-4" />
              <p className="text-slate-500 font-medium">Select a student to chat</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TutorMessages;