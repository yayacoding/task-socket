const db = require("../dbConfig");
const { Sequelize } = require("sequelize");
require("./task");
require("./user");

db.Sequelize = Sequelize;

module.exports = db;
