const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  enrolledCount: { type: Number, default: 0 }
}, { timestamps: true });   // ← `timestamps` automatically updates `updatedAt`

module.exports = mongoose.model('Course', courseSchema);