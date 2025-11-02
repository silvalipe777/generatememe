const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

const Meme = () => {
  const sequelize = getSequelize();

  return sequelize.define('Meme', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    caption: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: 'Anon'
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'memes',
    timestamps: true,
    indexes: [
      {
        fields: ['likes']
      },
      {
        fields: ['createdAt']
      }
    ]
  });
};

module.exports = Meme;
