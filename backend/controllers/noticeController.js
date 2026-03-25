const Notice = require('../models/Notice');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const populateNotice = (query) =>
    query
    .populate('createdBy', 'name email role')
    .populate('course', 'title subject tutor');

exports.createNotice = async(req, res) => {
    try {
        const { title, content, scope, courseId } = req.body;

        if (!title || !content || !scope) {
            return res.status(400).json({ success: false, message: 'Title, content, and scope are required' });
        }

        if (!['common', 'course'].includes(scope)) {
            return res.status(400).json({ success: false, message: 'Invalid scope' });
        }

        let selectedCourse = null;
        if (scope === 'course') {
            if (!courseId) {
                return res.status(400).json({ success: false, message: 'Course is required for module-wise notices' });
            }

            selectedCourse = await Course.findById(courseId);
            if (!selectedCourse) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            if (req.user.role === 'tutor' && selectedCourse.tutor.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You can only create module notices for your courses' });
            }
        }

        const notice = await Notice.create({
            title,
            content,
            scope,
            course: scope === 'course' ? selectedCourse._id : null,
            createdBy: req.user.id
        });

        const populated = await populateNotice(Notice.findById(notice._id));
        res.status(201).json({ success: true, data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyNotices = async(req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
        const notices = await populateNotice(Notice.find(filter).sort({ createdAt: -1 }));
        res.json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getVisibleStudentNotices = async(req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id, status: 'active' }).select('course');
        const enrolledCourseIds = enrollments.map((e) => e.course);

        const notices = await populateNotice(
            Notice.find({
                $or: [{ scope: 'common' }, { scope: 'course', course: { $in: enrolledCourseIds } }]
            }).sort({ createdAt: -1 })
        );

        res.json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNoticeById = async(req, res) => {
    try {
        const notice = await populateNotice(Notice.findById(req.params.id));
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        if (req.user.role === 'admin') {
            return res.json({ success: true, data: notice });
        }

        if (req.user.role === 'tutor') {
            if (notice.createdBy._id.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
            return res.json({ success: true, data: notice });
        }

        const isCommon = notice.scope === 'common';
        if (isCommon) {
            return res.json({ success: true, data: notice });
        }

        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: notice.course ? ._id,
            status: 'active'
        });

        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: notice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateNotice = async(req, res) => {
    try {
        const { title, content, scope, courseId } = req.body;
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        if (req.user.role !== 'admin' && notice.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (scope && !['common', 'course'].includes(scope)) {
            return res.status(400).json({ success: false, message: 'Invalid scope' });
        }

        const nextScope = scope || notice.scope;
        let nextCourseId = notice.course;

        if (nextScope === 'common') {
            nextCourseId = null;
        }

        if (nextScope === 'course') {
            const effectiveCourseId = courseId || notice.course;
            if (!effectiveCourseId) {
                return res.status(400).json({ success: false, message: 'Course is required for module-wise notices' });
            }

            const selectedCourse = await Course.findById(effectiveCourseId);
            if (!selectedCourse) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            if (req.user.role === 'tutor' && selectedCourse.tutor.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You can only assign your own course' });
            }
            nextCourseId = selectedCourse._id;
        }

        notice.title = title || notice.title;
        notice.content = content || notice.content;
        notice.scope = nextScope;
        notice.course = nextCourseId;

        await notice.save();

        const updated = await populateNotice(Notice.findById(notice._id));
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteNotice = async(req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        const isCreator = notice.createdBy.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await notice.deleteOne();
        res.json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};