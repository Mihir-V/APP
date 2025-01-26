# OTP Verification App

## Overview
This project is a two-step OTP verification system built using React Native for the front-end and Express.js for the back-end. It allows users to request an OTP sent to their email and verify it to proceed to a landing page.

## Features
- **Request OTP**: Users can request an OTP using their email address.
- **Email Integration**: Sends the OTP to the user via email.
- **Verify OTP**: Users can enter the OTP to verify their identity.
- **Database Support**: Stores and validates OTP codes using MySQL.
- **Error Handling**: Handles errors like invalid email, expired OTP, or server/database issues gracefully.

## Technologies Used

### Front-End
- React Native
- Expo Router
- Axios for HTTP requests

### Back-End
- Express.js
- MySQL for database
- Nodemailer for sending emails
- dotenv for environment variable management

## Project Setup

### Prerequisites
- Node.js
- MySQL server
- Expo CLI
- React Native environment setup

### Environment Variables
Create a `.env` file in the root directory with the following keys:

```env
PORT=3001
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
EMAIL_SERVICE=your_email_service_provider
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
```

### Database Setup
Run the following SQL commands to set up the required tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE otps (
  user_id INT NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-name.git
   ```
2. Navigate to the project directory:
   ```bash
   cd otp-verification-app
   ```
3. Install dependencies for the server:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run start
   ```
5. Install dependencies for the React Native app:
   ```bash
   cd app
   npm install
   ```
6. Start the React Native app:
   ```bash
   expo start
   ```

## API Endpoints

### Request OTP
**POST** `/request-otp`
- **Body**: `{ "email": "user@example.com" }`
- **Response**:
  - 200: `{ "message": "OTP sent successfully" }`
  - 404: `{ "message": "User not found" }`
  - 500: `{ "message": "Database error" }`

### Verify OTP
**POST** `/verify-otp`
- **Body**: `{ "email": "user@example.com", "otp": "123456" }`
- **Response**:
  - 200: `{ "message": "OTP verified successfully" }`
  - 400: `{ "message": "Invalid OTP" }`
  - 400: `{ "message": "OTP expired" }`
  - 404: `{ "message": "User not found" }`

## Folder Structure
```
.
├── server.js            # Back-end server code
├── app                  # Front-end React Native application
│   ├── index.js         # Send OTP screen
│   ├── VerifyOtpScreen.js # Verify OTP screen
│   └── ...
├── .env                 # Environment variables
└── README.md            # Project documentation
```

## Usage
1. Start the server.
2. Launch the React Native app.
3. Enter your email to request an OTP.
4. Check your email for the OTP.
5. Enter the OTP in the app to verify.

## Troubleshooting
- Ensure the server and database are running.
- Check `.env` file for correct configurations.
- Ensure your email service provider allows third-party app access.

## Contribution
Feel free to fork the repository and submit pull requests with improvements or bug fixes.
