const User = require('../models/users'); 
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();


router.get('/', authenticateToken, async (req, res) => {  
    const id = req.user.id;
    const user = await User.findByPk(id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    
    if( user.image !== null)
        user.image = `${req.protocol}://${req.get('host')}/${process.env.CONTAINNER}/${user.image}`;
    res.status(200).json({ message: 'User retrieved successfully.', user });

});


module.exports = router;