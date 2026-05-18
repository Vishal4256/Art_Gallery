import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Forgot password - Send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide email address');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User with this email does not exist');
  }

  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in user document (valid for 10 minutes)
  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  try {
    const htmlMessage = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #111; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; font-family: serif;">Lumina Gallery</h2>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 14px; color: #333; line-height: 1.6;">Hello,</p>
        <p style="font-size: 14px; color: #333; line-height: 1.6;">You requested a One-Time Password (OTP) to recover your account password. Please use the following code to complete your password reset:</p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; color: #111; letter-spacing: 5px; padding: 15px 0; background: #fafafa; border: 1px solid #eee; border-radius: 4px; margin: 20px 0; font-family: monospace;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">This OTP is valid for 10 minutes only. If you did not make this request, you can safely ignore this email.</p>
      </div>
    `;

    // Local Development Fallback: If Gmail SMTP is not set up, print the OTP to the console log and succeed!
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes('your_gmail')) {
      console.log('\n======================================================');
      console.log('✉️  [LOCAL DEV MODE] SMTP CREDENTIALS NOT CONFIGURED YET');
      console.log(`🔑 PASSWORD RESET OTP FOR ${user.email} IS:`);
      console.log(`               👉  ${otp}  👈`);
      console.log('======================================================\n');
      
      return res.json({ 
        message: 'OTP generated in Local Development Mode! Since SMTP credentials are not configured in server/.env, we printed the OTP to your server console window.' 
      });
    }

    await sendEmail({
      email: user.email,
      subject: 'Lumina Gallery - Password Reset Verification Code (OTP)',
      html: htmlMessage
    });

    res.json({ message: 'OTP sent to email successfully!' });
  } catch (error) {
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();
    
    res.status(500);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
});

// @desc    Verify OTP and Reset password
// @route   POST /api/auth/reset-password-otp
// @access  Public
export const resetPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Please provide email, otp code, and new password');
  }

  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetOTPExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP code');
  }

  user.password = newPassword;
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();

  res.json({ message: 'Password has been successfully updated!' });
});
