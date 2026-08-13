const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_HOST?.includes('gmail') ? 'gmail' : undefined,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Automatically extract a 4-6 digit OTP if present in the message
  let otpMatch = options.message ? options.message.match(/\b\d{4,6}\b/) : null;
  let otp = otpMatch ? otpMatch[0] : null;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f6; padding: 40px 0; }
  .main { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
  .header { background-color: #1B3A6B; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1.5px; font-weight: bold; }
  .content { padding: 40px 35px; color: #4a5568; line-height: 1.6; font-size: 16px; }
  .content p { margin: 0 0 20px 0; }
  .otp-container { margin: 35px 0; text-align: center; }
  .otp-box { display: inline-block; padding: 20px 40px; background-color: #f8fafc; border: 2px dashed #1B3A6B; border-radius: 12px; }
  .otp-label { margin: 0 0 10px 0; color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .otp-code { font-size: 36px; font-weight: bold; color: #1B3A6B; letter-spacing: 6px; margin: 0; }
  .footer { background-color: #f8fafc; padding: 25px; text-align: center; color: #a0aec0; font-size: 13px; border-top: 1px solid #edf2f7; }
  .footer p { margin: 0 0 10px 0; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="main">
      <div class="header">
        <h1>HananData</h1>
      </div>
      <div class="content">
        <p>${options.message}</p>
        
        ${otp ? `
        <div class="otp-container">
          <div class="otp-box">
            <p class="otp-label">Your Verification Code</p>
            <p class="otp-code">${otp}</p>
          </div>
        </div>
        ` : ''}
        
        <p style="margin-top: 30px; font-size: 14px; color: #718096;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} HananData. All rights reserved.</p>
        <p>Securing your digital lifestyle.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const message = {
    from: `${process.env.FROM_NAME || 'HananData'} <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || htmlContent
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
