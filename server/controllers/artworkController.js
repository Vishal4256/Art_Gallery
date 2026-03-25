import Artwork from '../models/artworkModel.js';

// @desc    Fetch all artworks
// @route   GET /api/artworks
// @access  Public
export const getArtworks = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    const artworks = await Artwork.find({ ...keyword, ...category }).populate('artist', 'name image');
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single artwork
// @route   GET /api/artworks/:id
// @access  Public
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate('artist', 'name bio image');

    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).json({ message: 'Artwork not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an artwork
// @route   POST /api/artworks
// @access  Private/Admin
export const createArtwork = async (req, res) => {
  try {
    const { title, description, artist, price, image, category } = req.body;

    const artwork = new Artwork({
      title,
      description,
      artist,
      price,
      image,
      category
    });

    const createdArtwork = await artwork.save();
    res.status(201).json(createdArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an artwork
// @route   DELETE /api/artworks/:id
// @access  Private/Admin
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (artwork) {
      await Artwork.deleteOne({ _id: artwork._id });
      res.json({ message: 'Artwork removed' });
    } else {
      res.status(404).json({ message: 'Artwork not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
