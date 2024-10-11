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
  duration: {
    type: Number, // Duration in hours
    required: false,
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
});

// Create and export the Opportunity model
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
