const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (to, subject, text, html) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILERSEND_SERVER, // Mailgun SMTP host
      port: process.env.MAILERSEND_PORT, // Standard SMTP port
      auth: {
        user: process.env.MAILERSEND_USER, // Your Mailgun SMTP username
        pass: process.env.MAILERSEND_PASS, // Your Mailgun SMTP password
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Smart Scheduler" MS_qmNndy@trial-ynrw7gyz0zj42k8e.mlsender.net', // Sender's email address
      to, // Recipient's email address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;
