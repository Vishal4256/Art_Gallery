import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle artwork in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { artworkId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const alreadyInWishlist = user.wishlist.find(
      (id) => id.toString() === artworkId.toString()
    );

    if (alreadyInWishlist) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== artworkId.toString()
      );
      await user.save();
      res.json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      user.wishlist.push(artworkId);
      await user.save();
      res.json({ message: 'Added to wishlist', action: 'added' });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
