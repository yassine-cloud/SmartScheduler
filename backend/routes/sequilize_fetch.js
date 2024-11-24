const express = require('express');
const router = express.Router();
const sequelizeController = require('../controllers/sequelizeController');


router.get('/update', async (req, res) => {
    try {
        await sequelizeController.synchonizeSchemaDataBase();
        res.status(200).json({ message: 'schema synchronized' });
    } catch (error) {
        res.status(400).json({ message: 'error when synchronizing', error });
    }
});

router.get('/create', async (req, res) => {
    try {
        await sequelizeController.forceSchemaDataBase();
        res.status(200).json({ message: 'schema forced' });
    } catch (error) {
        res.status(400).json({ message: 'error when forcing', error });
    }
});

module.exports = router;