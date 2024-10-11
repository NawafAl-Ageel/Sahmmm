const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  birthday: { type: Date, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'volunteer' } // Default role
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
module.exports = Volunteer;
