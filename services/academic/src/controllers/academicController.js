const { Career, Subject, Grade, Schedule } = require('../models');
const { Op } = require('sequelize');

// ═══════════════════════════════════════════════════════
// CAREERS
// ═══════════════════════════════════════════════════════

exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.findAll({
      where: { active: true },
      order: [['name', 'ASC']],
    });
    return res.json({ careers });
  } catch (err) {
    console.error('Get careers error:', err);
    return res.status(500).json({ error: 'Failed to fetch careers' });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }
    return res.json({ career });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch career' });
  }
};

exports.createCareer = async (req, res) => {
  try {
    const { name, code, duration, description } = req.body;
    
    const exists = await Career.findOne({ where: { code } });
    if (exists) {
      return res.status(409).json({ error: 'Career code already exists' });
    }

    const career = await Career.create({ name, code, duration, description });
    return res.status(201).json({ career });
  } catch (err) {
    console.error('Create career error:', err);
    return res.status(500).json({ error: 'Failed to create career' });
  }
};

// ═══════════════════════════════════════════════════════
// SUBJECTS
// ═══════════════════════════════════════════════════════

exports.getSubjects = async (req, res) => {
  try {
    const { careerId } = req.query;
    
    const where = { active: true };
    if (careerId) {
      where.careerId = careerId;
    }

    const subjects = await Subject.findAll({
      where,
      include: [{ model: Career, attributes: ['name', 'code'] }],
      order: [['year', 'ASC'], ['semester', 'ASC'], ['name', 'ASC']],
    });
    
    return res.json({ subjects });
  } catch (err) {
    console.error('Get subjects error:', err);
    return res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [{ model: Career }],
    });
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    return res.json({ subject });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch subject' });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { careerId, name, code, year, semester, syllabus } = req.body;
    
    const career = await Career.findByPk(careerId);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }

    const subject = await Subject.create({
      careerId, name, code, year, semester, syllabus
    });
    
    return res.status(201).json({ subject });
  } catch (err) {
    console.error('Create subject error:', err);
    return res.status(500).json({ error: 'Failed to create subject' });
  }
};

// ═══════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════

exports.getGrades = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const where = {};
    if (userId) {
      where.userId = userId;
    }

    const grades = await Grade.findAll({
      where,
      include: [{ 
        model: Subject,
        include: [{ model: Career }]
      }],
      order: [['date', 'DESC']],
    });
    
    return res.json({ grades });
  } catch (err) {
    console.error('Get grades error:', err);
    return res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const { userId, subjectId, grade, date, type, notes } = req.body;
    
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const newGrade = await Grade.create({
      userId, subjectId, grade, date, type, notes
    });
    
    return res.status(201).json({ grade: newGrade });
  } catch (err) {
    console.error('Create grade error:', err);
    return res.status(500).json({ error: 'Failed to create grade' });
  }
};

// ═══════════════════════════════════════════════════════
// SCHEDULES
// ═══════════════════════════════════════════════════════

exports.getSchedules = async (req, res) => {
  try {
    const { subjectId, turno } = req.query;
    
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (turno) where.turno = turno;

    const schedules = await Schedule.findAll({
      where,
      include: [{ 
        model: Subject,
        include: [{ model: Career }]
      }],
      order: [['day', 'ASC'], ['startTime', 'ASC']],
    });
    
    return res.json({ schedules });
  } catch (err) {
    console.error('Get schedules error:', err);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { subjectId, day, startTime, endTime, classroom, building, turno } = req.body;
    
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const schedule = await Schedule.create({
      subjectId, day, startTime, endTime, classroom, building, turno
    });
    
    return res.status(201).json({ schedule });
  } catch (err) {
    console.error('Create schedule error:', err);
    return res.status(500).json({ error: 'Failed to create schedule' });
  }
};
