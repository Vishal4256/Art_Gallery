import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // e.g. vishal42564256@gmail.com or another email
      pass: process.env.EMAIL_PASS  // e.g. Gmail App Password
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
