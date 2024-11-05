const sequelize = require('../config/sequelize');
require('dotenv').config();


/**
 * Synchronize the schema with the database
 * For development mode, it will alter the schema
 * 
 */
module.exports = {

    /**
     * it will synchronize the schema with the database
     */
    synchonizeSchemaDataBase : async () => {

        if(process.env.NODE_ENV === 'development') {
            // Synchronize the models with the database
            await sequelize.sync({alter: true});
            console.log('All models were synchronized successfully.');
        }
        else {
            console.log('This operation is only available in development mode.');
            throw new Error('This operation is only available in development mode.');
        }

    },

    /**
     * it will delete the schema and recreate it
     */
    forceSchemaDataBase : async () => {

        if(process.env.NODE_ENV === 'development') {
            // forces the models with the database
            await sequelize.sync({force: true});
            console.log('All models were synchronized successfully.');
        }
        else {
            console.log('This operation is only available in development mode.');
            throw new Error('This operation is only available in development mode.');
        }

    }


}