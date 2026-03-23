// backend/controllers/messageController.js
const Message = require('../models/Message');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Send a message (student to tutor or tutor to student)
// @route   POST /api/messages
// @access  Private (any logged-in user)
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, course, content } = req.body;
    const sender = req.user.id;

    // Validate: sender and receiver must be related to the course (if course provided)
    if (course) {
      const courseDoc = await Course.findById(course);
      if (!courseDoc) return res.status(404).json({ success: false, message: 'Course not found' });

      // If sender is student, check enrollment
      if (req.user.role === 'student') {
        const enrolled = await Enrollment.findOne({ student: sender, course, status: 'active' });
        if (!enrolled) return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
      } else if (req.user.role === 'tutor') {
        // Tutor must be the tutor of the course
        if (courseDoc.tutor.toString() !== sender) {
          return res.status(403).json({ success: false, message: 'Not the tutor of this course' });
        }
      } else if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      // Without course, allow only if it's an admin or maybe global messaging? We'll restrict to course-specific.
      return res.status(400).json({ success: false, message: 'Course is required for messaging' });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      course,
      content
    });

    // FIX: Populate before sending response so frontend doesn't get "ID only"
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('course', 'title');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages for the logged-in user (inbox)
// @route   GET /api/messages/inbox
// @access  Private
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('course', 'title')
      .sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sent messages
// @route   GET /api/messages/sent
// @access  Private
exports.getSent = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('course', 'title')
      .sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private (receiver only)
exports.markRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    message.read = true;
    await message.save();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation between two users for a specific course
// @route   GET /api/messages?course=:courseId&user=:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { course, user } = req.query;
    const currentUser = req.user.id;
    
    if (!course || !user) {
      return res.status(400).json({ success: false, message: 'Course and user parameters are required' });
    }
    
    const messages = await Message.find({
      course: course,
      $or: [
        { sender: currentUser, receiver: user },
        { sender: user, receiver: currentUser }
      ]
    }).sort('createdAt')
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
    
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};