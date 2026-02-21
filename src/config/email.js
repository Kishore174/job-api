const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,   // careers@crewminds.com
    pass: process.env.EMAIL_PASS    // password you created in Hostinger
  }
});

module.exports = transporter;