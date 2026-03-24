// src/utils/courseImg.js

const SUBJECT_IMAGES = {
  'Mathematics': 'https://images.unsplash.com/photo-1509228468518-180dd482200e?w=800&q=80',
  'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80',
  'Chemistry': 'https://images.unsplash.com/photo-1532187875605-182c48154671?w=800&q=80',
  'Biology': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
  'Computer Science': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  'Programming': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
  'Web Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  'Database Systems': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
  'Networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  'English Literature': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  'Economics': 'https://images.unsplash.com/photo-1611974714014-48324269d4bc?w=800&q=80',
  'Business Studies': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'Accounting': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80';

/**
 * Returns a suitable thumbnail URL for a course.
 * @param {Object} course - The course object containing thumbnail, subject, and _id.
 * @returns {string} - The URL of the thumbnail image.
 */
export const getCourseThumbnail = (course) => {
  if (course.thumbnail && course.thumbnail.trim() !== '') {
    return course.thumbnail;
  }

  if (course.subject && SUBJECT_IMAGES[course.subject]) {
    return SUBJECT_IMAGES[course.subject];
  }

  // If no subject match, use a seeded picsum for uniqueness if ID is available
  if (course._id) {
    return `https://picsum.photos/seed/${course._id}/800/400`;
  }

  return DEFAULT_IMAGE;
};
