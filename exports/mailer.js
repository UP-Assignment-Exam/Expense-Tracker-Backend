
// ====================
// EMAIL SERVICE CONFIGURATION
// ====================

const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_APP_PASSWORD // app-specific password
    },
    // Alternative SMTP configuration:
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_APP_PASSWORD
    // }
  });
};

// ====================
// EMAIL TEMPLATES
// ====================

const getPasswordResetEmailTemplate = (resetUrl, userEmail, expirationTime) => {
  return {
    subject: 'Password Reset Request - Your Blog Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 28px;
          }
          .email-content {
            padding: 40px 30px;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
          }
          .reset-button:hover {
            transform: translateY(-2px);
          }
          .security-info {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .divider {
            height: 1px;
            background: #e9ecef;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>🔒 Password Reset</h1>
          </div>
          
          <div class="email-content">
            <h2>Hello!</h2>
            <p>We received a request to reset the password for your account associated with <strong>${userEmail}</strong>.</p>
            
            <p>If you requested this password reset, click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a target="_blank" rel="noopener noreferrer" href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="security-info">
              <h3 style="margin-top: 0; color: #495057;">🛡️ Security Information</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link will expire in <strong>${expirationTime} minutes</strong></li>
                <li>If you didn't request this reset, you can safely ignore this email</li>
                <li>Your password won't change until you click the link above</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Alternative link:</strong></p>
            <p style="word-break: break-all; font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a target="_blank" rel="noopener noreferrer" href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from Your Blog Platform.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello!
      
      We received a request to reset the password for your account (${userEmail}).
      
      If you requested this password reset, click the link below to set a new password:
      ${resetUrl}
      
      This link will expire in ${expirationTime} minutes.
      
      If you didn't request this reset, you can safely ignore this email.
      Your password won't change until you click the link above.
      
      ---
      This is an automated message from Your Blog Platform.
    `
  };
};

module.exports = {
    createEmailTransporter,
    getPasswordResetEmailTemplate
};