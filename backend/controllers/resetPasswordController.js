const crypto = require('crypto');
const ResetPassword = require('../models/resetPassword');
const User = require('../models/users');
const sendMail = require('../services/emailSender');
require('dotenv').config();

const url = process.env.APP_CLIENT_URL;
const RESET_PASSWORD_EXPIRATION_HOURS = process.env.RESET_PASSWORD_EXPIRATION_HOURS || 1;

// Generate a random token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Create a reset password token
async function createResetPasswordToken(userId) {
    if (!userId) throw new Error('User ID is required for token generation.');

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(RESET_PASSWORD_EXPIRATION_HOURS, 10));
    try {
        await ResetPassword.create({ token, userId, expiresAt });
        return token;
    } catch (error) {
        throw new Error('Error creating reset password token. Please try again.');
    }
}

// Send the reset password email
async function sendResetPasswordEmail(to, token) {
    if (!to || !token) {
        throw new Error('Invalid email or token.');
    }

    const subject = 'Reset your password';
    const text = `Please reset your password by clicking on the following link: ${url}/reset-password/${token}`;
    const html = `<p>Please reset your password by clicking on the following link:</p><p><a href="${url}/reset-password/${token}">Reset your password</a></p>`;

    // try {
    //     await sendMail(to, subject, text, html);
    // } catch (error) {
    //     throw new Error('Error sending reset password email. Please try again.');
    // }

    console.log('Email sent to :', to);
    console.log('Email sent:', text);
}

// Reset the password
async function resetPassword(token, password) {
    if (!token || !password) {
        throw new Error('Token and password are required.');
    }

    const resetPasswordToken = await ResetPassword.findByToken(token);
    if (!resetPasswordToken) {
        throw new Error('Invalid or expired reset password token.');
    }
    if (resetPasswordToken.expiresAt < new Date()) {
        resetPasswordToken.destroy();
        throw new Error('Reset password token has expired.');
    }

    const user = await User.findById(resetPasswordToken.userId);
    if (!user) {
        throw new Error('User not found.');
    }

    user.passwordHash = password;
    await user.save();
    resetPasswordToken.destroy();
}

module.exports = {

    createResetPassword : async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            if(user.status == 'inactive') {
                return res.status(404).json({ message: 'User is inactive.' });
            }
            if (!user.is_verified) {
                return res.status(404).json({ message: 'User email is not verified.' });
            }
            const tokenAlready = await ResetPassword.findByUserId(user.id);
            if(tokenAlready) {
                if (tokenAlready.expiresAt > new Date())
                    return res.status(406).json({ message: 'Reset password email already sent.' });
                else
                    tokenAlready.destroy();
            }

            const token = await createResetPasswordToken(user.id);
            await sendResetPasswordEmail(email, token);

            res.status(200).json({ message: 'Reset password email sent.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    resetPassword : async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required.' });
        }

        try {

            await resetPassword(token, password);
            res.status(200).json({ message: 'Password reset successfully.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getUserFromResetToken : async (req, res) => {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required.' });
        }

        try {
            const resetPasswordToken = await ResetPassword.findByToken(token);
            if (!resetPasswordToken) {
                return res.status(404).json({ message: 'Invalid or expired reset password token.' });
            }
            if (resetPasswordToken.expiresAt < new Date()) {
                resetPasswordToken.destroy();
                return res.status(404).json({ message: 'Reset password token has expired.' });
            }

            const user = await User.findById(resetPasswordToken.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.status(200).json({ 
                user: { 
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName
                } 
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }



}