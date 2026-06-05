const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// ═══════════════════════════════════════════════════════
// CAREERS
// ═══════════════════════════════════════════════════════

// GET /api/academic/careers
router.get('/careers', academicController.getCareers);

// GET /api/academic/careers/:id
router.get('/careers/:id', academicController.getCareerById);

// POST /api/academic/careers (admin only)
router.post('/careers', authMiddleware, academicController.createCareer);

// ═══════════════════════════════════════════════════════
// SUBJECTS
// ═══════════════════════════════════════════════════════

// GET /api/academic/subjects?careerId=xxx
router.get('/subjects', academicController.getSubjects);

// GET /api/academic/subjects/:id
router.get('/subjects/:id', academicController.getSubjectById);

// POST /api/academic/subjects (admin only)
router.post('/subjects', authMiddleware, academicController.createSubject);

// ═══════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════

// GET /api/academic/grades?userId=xxx
router.get('/grades', authMiddleware, academicController.getGrades);

// POST /api/academic/grades (admin only)
router.post('/grades', authMiddleware, academicController.createGrade);

// ═══════════════════════════════════════════════════════
// SCHEDULES
// ═══════════════════════════════════════════════════════

// GET /api/academic/schedules?subjectId=xxx&turno=manana
router.get('/schedules', academicController.getSchedules);

// POST /api/academic/schedules (admin only)
router.post('/schedules', authMiddleware, academicController.createSchedule);

module.exports = router;
