const verificationTokenController = require('../controllers/verificationTokenController');
const express = require('express');
const router = express.Router();

router.get('/:token', verificationTokenController.verifyEmail);
router.get('/resend/:email', verificationTokenController.resendVerificationEmail);

module.exports = router;