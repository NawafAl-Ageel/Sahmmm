const mongoose = require('mongoose');

// Define the Opportunity schema
const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or file path for the image
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  participantsNeeded: {
    type: Number,
    required: true,
    min: 1, // Ensures at least one participant is needed
  },
  currentParticipants: {
    type: Number,
    default: 0, // Default to 0 if no participants yet
    min: 0,
  },
  duration: {
    type: Number, // Duration in hours
    required: false,
  },
  category: {
    type: String,
    enum: [
      'all', 'program', 'workshop', 'meetup', 'webinar', 'education', 
      'recreational', 'sports', 'relief',
    ], // Limit to specific categories
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization', // Reference to the Organization schema
    required: true,
  },
  files: [
    {
      fileName: { type: String, required: true }, // Original file name
      filePath: { type: String, required: true }, // Path to the file on the server
    },
  ],
});

// Create and export the Opportunity model
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
