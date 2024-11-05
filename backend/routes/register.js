const userController = require('../controllers/userController');
const multerUser = require('../middleware/multerUser');
const express = require('express');
const router = express.Router();

router.post('/', multerUser.single("image"), userController.register);

module.exports = router;