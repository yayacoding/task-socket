const db = require("../dbConfig");
const { DataTypes } = require("sequelize");

const user = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    modelName: "user",
  },
);

module.exports = user;
