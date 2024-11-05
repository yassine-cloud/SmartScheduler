require('dotenv').config();
const sequelize = require('../config/sequelize');

// An async function to handle the connection and synchronization
async function initializeDatabase() {
  try {
    // Confirm the connection is established
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Load models and define relationships
    require('../models/modelsRelations');


  } catch (error) {
    console.error('An error occurred while connecting to the database:', error);
    
  } 
}

// Execute the function
initializeDatabase();
