require('dotenv').config();

const Sequelize = require('sequelize');
let sequelize;

if (process.env.JAWSDB_URL) {
  // For JawsDB on Heroku
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // Local database credentials from .env
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, // Default MySQL port
    dialectOptions: {
      decimalNumbers: true,
    },
  });
}

module.exports = sequelize;
