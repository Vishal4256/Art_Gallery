import asyncHandler from 'express-async-handler';
import Artist from '../models/artistModel.js';

// @desc    Fetch all artists
// @route   GET /api/artists
// @access  Public
export const getArtists = asyncHandler(async (req, res) => {
  const artists = await Artist.find({});
  res.json(artists);
});

// @desc    Create an artist
// @route   POST /api/artists
// @access  Private/Admin
export const createArtist = asyncHandler(async (req, res) => {
  const { name, bio, image, socialLinks } = req.body;

  const artist = new Artist({
    name,
    bio,
    image,
    socialLinks: socialLinks || {}
  });

  const createdArtist = await artist.save();
  res.status(201).json(createdArtist);
});

// @desc    Fetch single artist
// @route   GET /api/artists/:id
// @access  Public
export const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (artist) {
    res.json(artist);
  } else {
    res.status(404);
    throw new Error('Artist not found');
  }
});

// @desc    Update an artist
// @route   PUT /api/artists/:id
// @access  Private/Admin
export const updateArtist = asyncHandler(async (req, res) => {
  const { name, bio, image, socialLinks } = req.body;
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    artist.name = name || artist.name;
    artist.bio = bio || artist.bio;
    artist.image = image !== undefined ? image : artist.image;
    artist.socialLinks = socialLinks || artist.socialLinks;

    const updatedArtist = await artist.save();
    res.json(updatedArtist);
  } else {
    res.status(404);
    throw new Error('Artist not found');
  }
});

// @desc    Delete an artist
// @route   DELETE /api/artists/:id
// @access  Private/Admin
export const deleteArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    await Artist.deleteOne({ _id: artist._id });
    res.json({ message: 'Artist removed' });
  } else {
    res.status(404);
    throw new Error('Artist not found');
  }
});
