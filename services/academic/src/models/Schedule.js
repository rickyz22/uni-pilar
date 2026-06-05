const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  day: {
    type: DataTypes.ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  classroom: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50],
    },
  },
  building: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100],
    },
  },
  turno: {
    type: DataTypes.ENUM('manana', 'tarde', 'noche'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'schedules',
});

module.exports = Schedule;
