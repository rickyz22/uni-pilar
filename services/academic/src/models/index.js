const sequelize = require('../config/database');
const Career = require('./Career');
const Subject = require('./Subject');
const Grade = require('./Grade');
const Schedule = require('./Schedule');

// Define relationships
Grade.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Grade, { foreignKey: 'subjectId' });

Schedule.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Schedule, { foreignKey: 'subjectId' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Career,
  Subject,
  Grade,
  Schedule,
};

module.exports = db;
