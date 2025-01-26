const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT;
require('dotenv').config();

app.use(cors({
  origin: '*',
  methods: 'GET, POST',
}));
app.use(express.json());
app.use(bodyParser.json());

// MySQL database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

// Listen on the provided port
app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.1.7:${PORT}`);
});

// Create routers for request-otp and verify-otp
const requestOtpRouter = express.Router();
const verifyOtpRouter = express.Router();

// Route for sending OTP
app.use('/request-otp', requestOtpRouter);

requestOtpRouter.post('/', async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  connection.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = results[0].id;
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes expiry

    // Insert OTP into the database
    connection.query(
      `INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE otp_code = ?, expires_at = ?`,
      [userId, otpCode, expiresAt, otpCode, expiresAt],
      async (error) => {
        if (error) return res.status(500).json({ message: 'Database error' });

        // Send OTP email
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your OTP code',
          text: `Your OTP code is ${otpCode}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Email error:', err);
            return res.status(500).json({ message: err });
          }
          console.log('Email sent successfully:', info);
          res.status(200).json({ message: 'OTP sent successfully' });
        });
      }
    );
  });
});

// Route for verifying OTP
app.use('/verify-otp', verifyOtpRouter);

verifyOtpRouter.post('/', async (req, res) => {
  const { email, otp } = req.body;

  // Check if user exists
  connection.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = results[0].id;

    // Query OTP from the database
    connection.query('SELECT otp_code, expires_at FROM otps WHERE user_id = ?', [userId], (error, otpResults) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      if (otpResults.length === 0) {
        return res.status(404).json({ message: 'OTP not found for this user' });
      }

      const { otp_code, expires_at } = otpResults[0];
      const currentTime = new Date();

      // Check if the OTP matches and hasn't expired
      if (otp !== otp_code) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (currentTime > new Date(expires_at)) {
        return res.status(400).json({ message: 'OTP expired' });
      }

      // OTP is valid
      return res.status(200).json({ message: 'OTP verified successfully' });
    });
  });
});
