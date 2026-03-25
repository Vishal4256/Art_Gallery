import Artist from '../models/artistModel.js';

// @desc    Fetch all artists
// @route   GET /api/artists
// @access  Public
export const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find({});
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an artist
// @route   POST /api/artists
// @access  Private/Admin
export const createArtist = async (req, res) => {
  try {
    const { name, bio, image, socialLinks } = req.body;

    const artist = new Artist({
      name,
      bio,
      image,
      socialLinks: socialLinks || {}
    });

    const createdArtist = await artist.save();
    res.status(201).json(createdArtist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single artist
// @route   GET /api/artists/:id
// @access  Public
export const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (artist) {
            res.json(artist);
        } else {
            res.status(404).json({ message: 'Artist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
