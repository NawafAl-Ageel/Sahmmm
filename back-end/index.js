const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Volunteer = require('./models/Volunteer'); // Ensure this file uses Mongoose models
const Organization = require('./models/Organization'); // Ensure this file uses Mongoose models
const mongoose = require('./config/database'); // Connect to MongoDB instead of Sequelize
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const Opportunity = require('./models/Opportunity'); // Import Opportunity schema
const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key'; // Use environment variables for production
/********************** */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
/****************** */
// Middleware
app.use(cors());
app.use(bodyParser.json());
///////////////*************** */
app.use('/uploads', express.static('uploads'));
///////////************************************** */

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
mongoose.connect('mongodb+srv://nawafsoftwareeng:12345@nawaf.mexql.mongodb.net/?retryWrites=true&w=majority&appName=Nawaf',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000 // Increase connection timeout to 20 seconds
  }
)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Connect to MongoDB
// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
// }).on('error', (error) => {
//   console.error('Error connecting to MongoDB:', error);
// });

// Sign Up for Volunteer
app.post('/singup-volunteer', async (req, res) => {
  const { name, email, birthday,city, password } = req.body;

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
      role: 'volunteer'
    });

    await newVolunteer.save();
    res.status(200).json({ message: 'Volunteer signed up successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up volunteer', error });
  }
});

//////////////////////////////////////************************************* */
app.post('/organization/postopportunity', upload.single('image'), verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  const { title, date, location, participants, description, duration } = req.body;
  const image = req.file ? req.file.filename : null; // Save the image file path

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
///////////////////////////////////////********************************************** */

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

// Middleware to Verify JWT Token


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

// Volunteer Profile Route
app.get('/volunteerprofile', verifyToken, async (req, res) => {
  if (req.userRole !== 'volunteer') {
    return res.status(403).json({ message: 'Access forbidden: not a volunteer' });
  }

  try {
    const volunteer = await Volunteer.findById(req.userId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer profile' });
  }
});

// Edit Volunteer Profile
app.put('/volunteerprofile', verifyToken, async (req, res) => {
  if (req.userRole !== 'volunteer') {
    return res.status(403).json({ message: 'Access forbidden: not a volunteer' });
  }

  const { name, email, birthday, password } = req.body;

  try {
    const volunteer = await Volunteer.findById(req.userId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.name = name || volunteer.name;
    volunteer.email = email || volunteer.email;
    volunteer.birthday = birthday || volunteer.birthday;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      volunteer.password = hashedPassword;
    }

    await volunteer.save();
    res.json({ message: 'Profile updated successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating volunteer profile', error });
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

app.delete('/deletevolunteer', verifyToken, async (req, res) => {
  try {
    // Get volunteer's ID from the verified token
    const volunteerId = req.userId;

    // Find and delete the volunteer from the database
    const deletedVolunteer = await Volunteer.findByIdAndDelete(volunteerId);

    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Send success response after successful deletion
    res.status(200).json({ message: 'Volunteer account deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer account:', error);
    res.status(500).json({ message: 'Server error while deleting volunteer account' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Post Opportunities MeThods // *****************************************************************
// Post Opportunities MeThods // *****************************************************************
// Post Opportunities MeThods // *****************************************************************
// Post Opportunities MeThods // *****************************************************************

// Post new opportunity (with image upload)



// Fetch all opportunities posted by the authenticated organization

// Post new opportunity (with image upload)
app.post('/organization/postopportunity', upload.single('image'), verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  const { title, date, location, participants, description, duration } = req.body;
  const image = req.file ? req.file.filename : null; // Save the image file path

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


// Fetch all opportunities posted by the authenticated organization
app.get('/organization/opportunities', verifyToken, async (req, res) => {
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  try {
    const opportunities = await Opportunity.find({ organization: req.userId }); // Fetch only opportunities by this org
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Error fetching opportunities', error });
  }
});

// Fetch a single opportunity by ID
app.get('/opportunity/:id', verifyToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ message: 'Error fetching opportunity', error });
  }
});