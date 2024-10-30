// New
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Volunteer = require('./models/Volunteer');
const Organization = require('./models/Organization');
const mongoose = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Opportunity = require('./models/Opportunity');
const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key'; // Use environment variables for production

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const ParticipationRequest = require('./models/ParticipationRequest');

// Send a participation request
app.post('/volunteer/request/:opportunityId', verifyToken, async (req, res) => {
  if (req.userRole !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can request participation.' });
  }

  const opportunityId = req.params.opportunityId;
  const volunteerId = req.userId;

  try {
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    const existingRequest = await ParticipationRequest.findOne({
      volunteer: volunteerId,
      opportunity: opportunityId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already submitted.' });
    }

    const newRequest = new ParticipationRequest({
      volunteer: volunteerId,
      opportunity: opportunityId,
      organization: opportunity.organization,
    });

    await newRequest.save();
    res.status(200).json({ message: 'Request sent successfully.' });

  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({ message: 'Server error while sending request.' });
  }
});

// Sign Up for Volunteer
app.post('/singup-volunteer', async (req, res) => {
  const { name, email, birthday, city, password, gender } = req.body;

  try {
    const volunteerExists = await Volunteer.findOne({ email });
    if (volunteerExists) {
      return res.status(400).json({ message: 'Volunteer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVolunteer = new Volunteer({
      name,
      email,
      birthday,
      city,
      password: hashedPassword,
      role: 'volunteer',
      gender
    });

    await newVolunteer.save();
    res.status(200).json({ message: 'Volunteer signed up successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up volunteer', error });
  }
});

// Sign Up for Organization
app.post('/singup-organization', async (req, res) => {
  const { name, email, address, password } = req.body;

  try {
    const organizationExists = await Organization.findOne({ email });
    if (organizationExists) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOrganization = new Organization({
      name,
      email,
      address,
      password: hashedPassword,
      role: 'organization'
    });

    await newOrganization.save();
    res.status(200).json({ message: 'Organization signed up successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up organization', error });
  }
});

// Sign In for Volunteer
app.post('/singin-volunteer', async (req, res) => {
  const { email, password } = req.body;

  try {
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: 'No volunteer found with this email' });
    }

    const isPasswordValid = await bcrypt.compare(password, volunteer.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: volunteer._id, role: 'volunteer' }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, user: volunteer });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error signing in volunteer', error });
  }
});

// Sign In for Organization
app.post('/singin-organization', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (role !== 'organization') {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const organization = await Organization.findOne({ email });
    if (!organization) {
      return res.status(400).json({ message: 'No organization found with this email' });
    }

    const isPasswordValid = await bcrypt.compare(password, organization.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: organization._id, role }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, user: organization });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error signing in as organization', error });
  }
});

// Accept/Reject participation request
app.put('/organization/requests/:id', verifyToken, async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  try {
    const updatedRequest = await ParticipationRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status', error });
  }
});

// Organization Profile Route
app.get('/organization-profile', verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  try {
    const organization = await Organization.findById(req.userId);
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization profile' });
  }
});

// Get organization requests
app.get('/organization/requests', verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: only organizations can view requests.' });
  }

  try {
    const requests = await ParticipationRequest.find({ organization: req.userId })
      .populate('volunteer')
      .populate('opportunity');
      
    res.json(requests);

  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error while fetching requests.' });
  }
});

// Get volunteer request status
app.get('/volunteer/request-status/:opportunityId', verifyToken, async (req, res) => {
  const { opportunityId } = req.params;
  
  try {
    const existingRequest = await ParticipationRequest.findOne({
      opportunity: opportunityId,
      volunteer: req.userId,
    });
    
    if (!existingRequest) {
      return res.json({ status: 'idle' });
    }
    
    res.json({ status: existingRequest.status });
  } catch (error) {
    console.error('Error fetching request status:', error);
    res.status(500).json({ message: 'Error fetching request status' });
  }
});

//volunteer retriver
app.get('/organization/volunteers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch volunteers associated with the opportunity ID
    const volunteers = await Volunteers.find({ opportunityId: id });

    if (!volunteers || volunteers.length === 0) {
      return res.status(404).json({ message: 'No volunteers found for this opportunity.' });
    }

    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Delete Organization Account
app.delete('/deleteorganization', verifyToken, async (req, res) => {
  try {
    const organizationId = req.userId;

    const deletedOrganization = await Organization.findByIdAndDelete(organizationId);

    if (!deletedOrganization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization account deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization account:', error);
    res.status(500).json({ message: 'Server error while deleting organization account' });
  }
});

// Delete Volunteer Account
app.delete('/deletevolunteer', verifyToken, async (req, res) => {
  try {
    console.log('Attempting to delete volunteer with ID:', req.userId);

    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.userId);

    if (!deletedVolunteer) {
      console.log('Volunteer not found for deletion');
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    console.log('Volunteer deleted successfully:', deletedVolunteer);
    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Error deleting volunteer', error: error.message });
  }
});

// Post new opportunity (with image upload)
app.post('/organization/postopportunity', upload.single('image'), verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  const { title, date, location, participants, description, duration } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newOpportunity = new Opportunity({
      title,
      description,
      date,
      location,
      participantsNeeded: participants,
      duration,
      image,
      organization: req.userId,
    });

    await newOpportunity.save();
    res.status(200).json({ message: 'Opportunity posted successfully!' });
  } catch (error) {
    console.error('Error posting opportunity:', error);
    res.status(500).json({ message: 'Error posting opportunity', error });
  }
});

// Delete opportunity
app.delete('/organization/opportunities/:id', verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  const opportunityId = req.params.id;

  try {
    console.log('Attempting to delete opportunity:', opportunityId);
    const opportunity = await Opportunity.findOne({ _id: opportunityId, organization: req.userId });

    if (!opportunity) {
      console.log('Opportunity not found or user does not have permission');
      return res.status(404).json({ message: 'Opportunity not found or you do not have permission to delete it' });
    }

    await Opportunity.findByIdAndDelete(opportunityId);
    await ParticipationRequest.deleteMany({ opportunity: opportunityId });

    console.log('Opportunity deleted successfully');
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ message: 'Error deleting opportunity', error: error.message });
  }
});

// Edit opportunity
app.put('/organization/opportunities/:id', verifyToken, upload.single('image'), async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  const { id } = req.params;
  const { title, date, location, participants, description, duration } = req.body;
  const updateData = { title, date, location, participantsNeeded: participants, description, duration };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    const opportunity = await Opportunity.findOne({ _id: id, organization: req.userId });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found or you do not have permission to edit it' });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Opportunity updated successfully', opportunity: updatedOpportunity });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ message: 'Error updating opportunity', error });
  }
});

// Get Volunteer Profile
app.get('/volunteerprofile', verifyToken, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.userId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

app.get('/opportunities', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of opportunities per page
  const skip = (page - 1) * limit;
  
  const opportunities = await Opportunity.find().skip(skip).limit(limit);
  res.json(opportunities);
});

// Update Volunteer Profile (City of Residence)
app.put('/volunteerprofile', verifyToken, async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.userId,
      { city: req.body.city },
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(updatedVolunteer);
  } catch (error) {
    console.error('Error updating volunteer profile:', error);
    res.status(500).json({ message: 'Error updating volunteer profile', error });
  }
});

// Upload Volunteer Profile Picture
app.put('/volunteerprofile/picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.userId,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(updatedVolunteer);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
});

// Fetch all opportunities posted by the authenticated organization
app.get('/organization/opportunities', verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  try {
    const opportunities = await Opportunity.find({ organization: req.userId });
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Error fetching opportunities', error });
  }
});

// Fetch a single opportunity by ID
app.get('/opportunity/:id', async (req, res) => {
  console.log(`Attempting to fetch opportunity with ID: ${req.params.id}`);
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('organization', 'name');
    if (!opportunity) {
      console.log(`Opportunity with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    console.log(`Successfully fetched opportunity: ${opportunity._id}`);
    res.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ message: 'Error fetching opportunity', error: error.message });
  }
});

app.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    console.log(`Found ${opportunities.length} opportunities`);
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Error fetching opportunities', error: error.message });
  }
});
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});