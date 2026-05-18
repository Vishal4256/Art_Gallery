import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const makeAdmin = async () => {
  try {
    const email = 'vishal42564256@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Successfully updated existing user ${email} to ADMIN role!`);
    } else {
      user = await User.create({
        name: 'Vishal Admin',
        email: email,
        password: 'password123',
        role: 'admin'
      });
      console.log(`Created a new ADMIN user for ${email} with password: password123`);
    }
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

makeAdmin();
