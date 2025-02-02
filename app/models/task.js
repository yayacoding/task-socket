const db = require("../dbConfig");
const { DataTypes } = require("sequelize");

const task = db.define(
  "task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    assignedTo: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
    modelName: "task",
  },
);

module.exports = task;
