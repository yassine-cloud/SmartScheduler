const crypto = require('crypto');
const VerificationToken = require('../models/verificationTokens');
const User = require('../models/users');
const sendMail = require('../services/emailSender'); 
require('dotenv').config();

const url = process.env.APP_CLIENT_URL
const TOKEN_EXPIRATION_HOURS = process.env.TOKEN_EXPIRATION_HOURS || 24;

// Generate a random token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Create a verification token
async function createVerificationToken(userId ) {
    if (!userId) throw new Error('User ID is required for token generation.');

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(TOKEN_EXPIRATION_HOURS, 10));
    try {
        await VerificationToken.create({ token, userId, expiresAt });
        return token;
    } catch (error) {
        throw new Error('Error creating verification token. Please try again.');
    }
}

// Send the verification email
async function sendVerificationEmail(to, token) {
    if (!to || !token) {
        throw new Error('Invalid email or token.');
    }

    const subject = 'Please verify your email address';
    const text = `Please verify your email address by clicking on the following link: ${url}/verify/${token}`;
    const html = `<p>Please verify your email address by clicking on the following link:</p><p><a href="${url}/verify/${token}">Verify your email address</a></p>`;
    
    // try {
    //      await sendMail(to, subject, text, html);
    //  } catch (error) {
    //      throw new Error('Error sending verification email. Please try again.');
    // }
    
    console.log('Email sent to :', to);
    console.log('Email sent:', text);
}

// Verify the email address
async function verifyEmail(token) {
    if (!token) throw new Error('No token provided.');

    const verificationToken = await VerificationToken.findByToken(token);
    if (!verificationToken) {
        throw new Error('Invalid or expired verification token.');
    }
    if (verificationToken.expiresAt < new Date()) {
        verificationToken.destroy();
        throw new Error('Verification token has expired.');
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) {
        throw new Error('User not found.');
    }

    user.is_verified = true;
    await user.save();
    
    await verificationToken.destroy();
}

module.exports = {

    createVerificationNewUser : async (userId, email) => {
        try {
            if (!userId || !email) {
                throw new Error('User ID and email are required.');
            }
            
            const token = await createVerificationToken(userId);
            await sendVerificationEmail(email, token);
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    },

    verifyEmail : async (req, res) => {
        try {
            const token = req.params.token;
            await verifyEmail(token);
            res.status(200).json({ message: 'Email address verified.' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    resendVerificationEmail : async (req, res) => {
        try {
            const { email } = req.params;
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'User not found.' });
            }
            if (user.is_verified) {
                return res.status(405).json({ message: 'Email address already verified.' });
            }
            const verificationToken = await VerificationToken.findByUserId(user.id);
            let token;
            if (verificationToken && verificationToken.expiresAt > new Date()) {
                return res.status(406).json({ message: 'Verification email already sent.' });
            }
            else if (verificationToken) {
                token = verificationToken.token;
                verificationToken.expiresAt = new Date();
                verificationToken.expiresAt.setHours(verificationToken.expiresAt.getHours() + parseInt(TOKEN_EXPIRATION_HOURS, 10));
                await verificationToken.save();
            }
            else {
                token = await createVerificationToken(user.id);
            }
            await sendVerificationEmail(user.email, token);
            res.status(200).json({ message: 'Verification email sent.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}
