const User = require('../models/users'); 
var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');


router.get('/', authenticateToken, async (req, res) => {  
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    
    if( user.image !== null)
        user.image = `${req.protocol}://${req.get('host')}/uploads/${user.image}`;
    res.status(200).json({ message: 'User retrieved successfully.', user });

});


module.exports = router;