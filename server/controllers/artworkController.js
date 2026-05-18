import asyncHandler from 'express-async-handler';
import Artwork from '../models/artworkModel.js';
import Artist from '../models/artistModel.js';

// @desc    Fetch all artworks
// @route   GET /api/artworks
// @access  Public
export const getArtworks = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  let query = {};

  // Keyword search (title)
  if (req.query.keyword) {
    query.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { category: { $regex: req.query.keyword, $options: 'i' } }
    ];
  }

  // Exact category filter
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  // Price filtering
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  
  // Artist filtering
  if (req.query.artist && req.query.artist !== 'All') {
    // If we receive artist name, we need to find the artist ID first
    const artistDoc = await Artist.findOne({ name: { $regex: req.query.artist, $options: 'i' } });
    if (artistDoc) {
      query.artist = artistDoc._id;
    }
  }

  const count = await Artwork.countDocuments({ ...query });
  const artworks = await Artwork.find({ ...query })
    .populate('artist', 'name image')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ artworks, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single artwork
// @route   GET /api/artworks/:id
// @access  Public
export const getArtworkById = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id).populate('artist', 'name bio image');

  if (artwork) {
    res.json(artwork);
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});

// @desc    Create an artwork
// @route   POST /api/artworks
// @access  Private/Admin
export const createArtwork = asyncHandler(async (req, res) => {
  const { title, description, artist, price, image, category } = req.body;

  const artwork = new Artwork({
    title,
    description,
    artist,
    price,
    image,
    category,
    createdBy: req.user._id
  });

  const createdArtwork = await artwork.save();
  res.status(201).json(createdArtwork);
});

// @desc    Delete an artwork
// @route   DELETE /api/artworks/:id
// @access  Private/Admin
export const deleteArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);

  if (artwork) {
    await Artwork.deleteOne({ _id: artwork._id });
    res.json({ message: 'Artwork removed' });
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});

// @desc    Update an artwork
// @route   PUT /api/artworks/:id
// @access  Private/Admin
export const updateArtwork = asyncHandler(async (req, res) => {
  const { title, description, artist, price, image, category } = req.body;
  const artwork = await Artwork.findById(req.params.id);

  if (artwork) {
    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.artist = artist || artwork.artist;
    artwork.price = price !== undefined ? price : artwork.price;
    artwork.image = image !== undefined ? image : artwork.image;
    artwork.category = category || artwork.category;

    const updatedArtwork = await artwork.save();
    res.json(updatedArtwork);
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});
