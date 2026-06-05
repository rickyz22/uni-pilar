const sequelize = require('../config/database');
const User = require('./User');

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
};

module.exports = db;
