const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  ratingValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // التقييم من 1 إلى 5
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity', // الربط مع جدول الفرص
    required: true,
  },
  volunteer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Volunteer', required: false },
});

module.exports = mongoose.model('Rating', RatingSchema);
