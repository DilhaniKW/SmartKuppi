const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Enroll a student in a course
// @route   POST /api/courses/:courseId/enroll
// @access  Private (Student only)
exports.enroll = async(req, res) => {
    try {
        const { courseId } = req.params;
        const student = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        // Check if already enrolled
        const existing = await Enrollment.findOne({ student, course: courseId, status: 'active' });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        // Create enrollment
        await Enrollment.create({ student, course: courseId });

        // Increment enrolledCount in course
        course.enrolledCount += 1;
        await course.save();

        try {
            const studentUser = await User.findById(student).select('name');
            const studentName = studentUser ? .name || 'A student';
            await createNotification({
                recipient: course.tutor,
                sender: student,
                type: 'enrollment',
                title: 'New Enrollment',
                message: `${studentName} enrolled in ${course.title}`,
                link: '/tutor-dashboard',
                metadata: {
                    courseId: course._id,
                    studentId: student
                }
            });
        } catch (notificationError) {
            console.error('Failed to create enrollment notification:', notificationError.message);
        }

        res.status(201).json({ success: true, message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Drop a course (remove enrollment)
// @route   DELETE /api/courses/:courseId/drop
// @access  Private (Student only)
exports.drop = async(req, res) => {
    try {
        const { courseId } = req.params;
        const student = req.user.id;

        const enrollment = await Enrollment.findOne({ student, course: courseId, status: 'active' });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Not enrolled' });
        }

        enrollment.status = 'dropped';
        await enrollment.save();

        // Decrement enrolledCount
        await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: -1 } });

        res.json({ success: true, message: 'Dropped successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get courses a student is enrolled in
// @route   GET /api/students/:studentId/courses
// @access  Private (Student themselves or admin)
exports.getStudentCourses = async(req, res) => {
    try {
        const { studentId } = req.params;
        if (req.user.id !== studentId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const enrollments = await Enrollment.find({ student: studentId, status: 'active' })
            .populate('course')
            .sort('-enrolledAt');

        const courses = enrollments.map(e => e.course);
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get students enrolled in a course (for tutor)
// @route   GET /api/courses/:courseId/students
// @access  Private (Tutor of the course)
exports.getCourseStudents = async(req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        if (course.tutor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const enrollments = await Enrollment.find({ course: courseId, status: 'active' })
            .populate('student', 'name email')
            .sort('-enrolledAt');

        res.json({ success: true, data: enrollments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};