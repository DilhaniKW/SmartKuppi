// src/components/CourseCardHeader.js
import React from 'react';
import { 
  GraduationCap, Book, Code, Calculator, Zap, 
  FlaskConical, Dna, BarChart3, Binary, Globe
} from 'lucide-react';

const SUBJECT_CONFIG = {
  'Mathematics': { icon: Calculator, color: 'from-blue-500 to-indigo-600' },
  'Physics': { icon: Zap, color: 'from-amber-400 to-orange-500' },
  'Chemistry': { icon: FlaskConical, color: 'from-emerald-400 to-teal-500' },
  'Biology': { icon: Dna, color: 'from-rose-400 to-pink-500' },
  'Computer Science': { icon: GraduationCap, color: 'from-slate-700 to-slate-900' },
  'Programming': { icon: GraduationCap, color: 'from-indigo-500 to-purple-600' },
  'Web Development': { icon: GraduationCap, color: 'from-cyan-500 to-blue-600' },
  'Database Systems': { icon: Code, color: 'from-blue-600 to-indigo-800' },
  'English Literature': { icon: Book, color: 'from-orange-400 to-red-500' },
  'Economics': { icon: BarChart3, color: 'from-emerald-600 to-teal-800' },
  'Business Studies': { icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
  'Accounting': { icon: Calculator, color: 'from-slate-500 to-slate-700' }
};

const DEFAULT_CONFIG = { icon: GraduationCap, color: 'from-indigo-500 to-indigo-600' };

const CourseCardHeader = ({ course, height = 'h-48', children }) => {
  const config = SUBJECT_CONFIG[course.subject] || DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className={`relative ${height} overflow-hidden bg-gradient-to-r ${config.color} flex items-center justify-center`}>
      <Icon className="h-16 w-16 text-white/60" />
      <div className="absolute bottom-4 left-4">
        <span className="text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full uppercase tracking-wider">
          {course.subject || 'Course'}
        </span>
      </div>
      {children}
    </div>
  );
};

export default CourseCardHeader;
