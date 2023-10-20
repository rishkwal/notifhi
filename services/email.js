const nodemailer = require('nodemailer');

const sendEmail = async (subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,    // e.g. 'smtp.gmail.com'
        port: process.env.SMTP_PORT,    // e.g. 587
        secure: process.env.SMTP_SECURE === 'true', // true for 465 (secure), false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_FROM_ADDRESS,       // Sender address
        to: process.env.SMTP_RECEIVER_ADDRESS,     // List of receivers
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.default = sendEmail