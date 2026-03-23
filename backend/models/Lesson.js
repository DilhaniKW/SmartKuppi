const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  meetingLink: { type: String, required: true },
  meetingPassword: { type: String, default: '' },
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);