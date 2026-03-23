// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getInbox,
  getSent,
  markRead,
  getConversation
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/sent', getSent);
router.put('/:id/read', markRead);
router.get('/', getConversation);  // This handles the query params for conversation

module.exports = router;