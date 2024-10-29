const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  birthday: { type: Date, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true }, // Added gender field
  role: { type: String, default: 'volunteer' }, // Default role
  opportunitiesParticipated: {type: Number,default: 0 }, // Default to 0 since initially no opportunities might be participated
  currentOpportunities: { type: Number,default: 0 },// Default to 0 if there are no current opportunities
  profilePicture: {type: String, default: 'images/default-profile.png'},// Default profile picture

}, { timestamps: true });



const Volunteer = mongoose.model('Volunteer', volunteerSchema);
module.exports = Volunteer;
