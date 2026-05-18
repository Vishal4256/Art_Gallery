import Contact from '../models/contactModel.js';

// @desc    Send contact inquiry
// @route   POST /api/contact
// @access  Public
export const sendInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const inquiry = new Contact({
      name,
      email,
      subject,
      message
    });

    await inquiry.save();

    console.log(`Inquiry received from ${name} (${email}): [${subject}] ${message}`);

    res.status(201).json({ message: 'Inquiry sent successfully. We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private/Admin
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
      await Contact.deleteOne({ _id: inquiry._id });
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
