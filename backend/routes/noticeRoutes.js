const express = require('express');
const router = express.Router();
const {
    createNotice,
    getMyNotices,
    getVisibleStudentNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/student', authorize('student'), getVisibleStudentNotices);
router.get('/my', authorize('tutor', 'admin'), getMyNotices);
router.get('/:id', getNoticeById);

router.post('/', authorize('tutor', 'admin'), createNotice);
router.put('/:id', authorize('tutor', 'admin'), updateNotice);
router.delete('/:id', authorize('tutor', 'admin'), deleteNotice);

module.exports = router;