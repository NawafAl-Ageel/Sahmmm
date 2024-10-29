const mongoose = require('mongoose');

const participationRequestSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true,
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ParticipationRequest = mongoose.model('ParticipationRequest', participationRequestSchema);
module.exports = ParticipationRequest;
