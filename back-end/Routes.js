const express = require('express');
const multer = require('multer');
const Opportunity = require('./models/Opportunity'); // Correct path to the Opportunity model
const router = express.Router(); // Use express.Router()

// Multer storage configuration (reuse your existing code)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Endpoint to fetch opportunities
router.get('/opportunities', async (req, res) => {
  const { category } = req.query;

  try {
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    const opportunities = await Opportunity.find(query);
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Endpoint to upload files for an opportunity
router.post('/opportunities/upload', upload.single('file'), async (req, res) => {
  try {
    const { opportunityId } = req.body;

    // Validate that an opportunity ID was provided
    if (!opportunityId) {
      return res.status(400).json({ message: 'Opportunity ID is required.' });
    }

    // Ensure the file was uploaded successfully
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Create the file object
    const file = {
      fileName: req.file.originalname,
      filePath: req.file.path,
    };

    // Use findByIdAndUpdate to only update the files field
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      opportunityId,
      { $push: { files: file } }, // Push the file object to the files array
      { new: true, runValidators: false } // Do not run validators on the entire document
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    res.status(200).json({ message: 'File uploaded successfully.', file });
  } catch (error) {
    console.error('Error uploading file:', error);

    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error.', details: error.errors });
    }

    // For other errors, return a generic server error
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



module.exports = router;
