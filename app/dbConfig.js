const { Sequelize } = require("sequelize");
require("dotenv").config();
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: true,
    dialect: process.env.DB_DIALECT,
  },
);

db.authenticate().then(() => {
  console.log("Database connected");
  return db.sync({ force: false });
});

module.exports = db;
