const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SMTP port for Gmail
  secure: true, // Use `true` for port 465
  auth: {
    user: "Include Your Email Address",
    pass: "Include Your App Password",
  },
});

async function sendWelcomeEmail(userEmail, userName) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to PotBiriyani</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid #dddddd;
      }
      .header img {
        width: 200px;
        height: auto;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h1 {
        color: #333333;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        color: #555555;
        font-size: 16px;
        line-height: 1.5;
      }
      .cta-button {
        display: inline-block;
        font-size: 16px;
        color: #ffffff;
        background-color: #ff5722;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        border-top: 1px solid #dddddd;
        color: #777777;
        font-size: 14px;
      }
      .footer a {
        color: #ff5722;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="https://example.com/logo.png" alt="PotBiriyani Logo">
      </div>
      <div class="content">
        <h1>Welcome to PotBiriyani!</h1>
        <p>Dear ${userName},</p>
        <p>Thank you for joining PotBiriyani! We are excited to have you as part of our community. Our team is dedicated to providing you with the best biriyani and dining experience.</p>
        <p>As a new member, we invite you to explore our diverse menu and enjoy our exclusive offers. Click the button below to view our menu and discover the flavors awaiting you.</p>
        <a href="https://example.com/menu" class="cta-button">Explore Our Menu</a>
      </div>
      <div class="footer">
        <p>&copy; 2024 PotBiriyani. All rights reserved.</p>
        <p>If you have any questions or need assistance, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // Send email with defined transport object
  const info = await transporter.sendMail({
    from: "Include Your Email Address", // sender address
    to: userEmail, // recipient address
    subject: "Welcome to PotBiriyani!", // Subject line
    html: htmlContent, // HTML body
  });

  console.log("Welcome email sent: %s", info.messageId);
}

module.exports = { sendWelcomeEmail };
