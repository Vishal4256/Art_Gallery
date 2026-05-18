import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter with robust, explicit Gmail secure configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use true for SSL/TLS on port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Avoid blocking by local firewalls
    }
  });

  const mailOptions = {
    from: `"Lumina Gallery" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
