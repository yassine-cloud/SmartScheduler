const ResetPasswordController = require('../controllers/resetPasswordController');
const express = require('express');
const router = express.Router();

router.post('/', ResetPasswordController.createResetPassword); // make at the front allways return 200 for security reasons
router.post('/:token', ResetPasswordController.resetPassword);
router.get('/:token', ResetPasswordController.getUserFromResetToken);

module.exports = router;