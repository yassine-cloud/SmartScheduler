const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log("the connection to the DataBase is configured as: ", process.env.DB_NAME," " , process.env.DB_USER, " ", process.env.DB_PASS, " ", process.env.DB_HOST);


// Create a connection to the database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});


module.exports = sequelize;
