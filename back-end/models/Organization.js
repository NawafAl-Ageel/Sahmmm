const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'organization' }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
