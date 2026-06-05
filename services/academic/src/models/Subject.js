const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Career = require('./Career');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  careerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Career,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200],
    },
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 20],
    },
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 2,
    },
  },
  syllabus: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Subject syllabus/curriculum',
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'subjects',
});

Subject.belongsTo(Career, { foreignKey: 'careerId' });
Career.hasMany(Subject, { foreignKey: 'careerId' });

module.exports = Subject;
