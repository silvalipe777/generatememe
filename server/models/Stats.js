const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

const Stats = () => {
  const sequelize = getSequelize();

  return sequelize.define('Stats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalMemes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalVisitors: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'stats',
    timestamps: true
  });
};

module.exports = Stats;
