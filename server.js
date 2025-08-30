require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourportfolio.com']
}));
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'somashekharjavooru@gmail.com', // Your email
    pass: process.env.EMAIL_PASS // Using environment variable for password
  },
  tls: {
    rejectUnauthorized: false // For testing only (remove in production)
  }
});

// Email endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
      from: '"Somashekhar Portfolio" <somashekharjavooru@gmail.com>',
      to: 'somashekharjavooru@gmail.com', // Where emails will be sent
      replyTo: email,
      subject: subject || 'New message from your portfolio',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <hr>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));