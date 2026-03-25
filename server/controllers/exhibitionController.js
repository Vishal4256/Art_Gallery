import Exhibition from '../models/exhibitionModel.js';

// @desc    Fetch all exhibitions
// @route   GET /api/exhibitions
// @access  Public
export const getExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({});
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single exhibition
// @route   GET /api/exhibitions/:id
// @access  Public
export const getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);

    if (exhibition) {
      res.json(exhibition);
    } else {
      res.status(404).json({ message: 'Exhibition not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an exhibition
// @route   POST /api/exhibitions
// @access  Private/Admin
export const createExhibition = async (req, res) => {
  try {
    const { title, description, startDate, endDate, image } = req.body;

    const exhibition = new Exhibition({
      title,
      description,
      startDate,
      endDate,
      image
    });

    const createdExhibition = await exhibition.save();
    res.status(201).json(createdExhibition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
