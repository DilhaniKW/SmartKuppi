const express = require('express');
const router = express.Router();
const {
  enroll,
  drop,
  getStudentCourses,
  getCourseStudents
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/courses/:courseId/enroll', authorize('student'), enroll);
router.delete('/courses/:courseId/drop', authorize('student'), drop);
router.get('/students/:studentId/courses', getStudentCourses); // check authorization inside
router.get('/courses/:courseId/students', authorize('tutor', 'admin'), getCourseStudents);

module.exports = router;