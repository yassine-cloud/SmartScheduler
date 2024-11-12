require('dotenv').config();
const sequelize = require('../config/sequelize');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    require('../models/modelsRelations');


  } catch (error) {
    console.error('An error occurred while connecting to the database:', error);
    
  } 
}

initializeDatabase();
