// New
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

const handleCardClick = (id) => {
  console.log('Navigating to opportunity with ID:', id); // Add this for debugging
  navigate(`/opportunity/${id}`);
};


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

const ParticipationRequest = require('./models/ParticipationRequest');

// Send a participation request




// Accept/Reject participation request


//*************************************************************************************************************************
//******************************** استخدم database.js  استخدم ملف config عشان تربط بالداتابيس *************************                                                  
mongoose.connect('mongodb+srv://nawafsoftwareeng:12345@nawaf.mexql.mongodb.net/?retryWrites=true&w=majority&appName=Nawaf',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 20000 // Increase connection timeout to 20 seconds
  }
)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

//*************************************************************************************************************************

// Sign Up for Volunteer

app.post('/volunteer/request/:opportunityId', verifyToken, async (req, res) => {
  if (req.userRole !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can request participation.' });
  }

  const opportunityId = req.params.opportunityId;
  const volunteerId = req.userId;

  try {
    // Find the opportunity and organization related to it
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found.' });
    }

    // Check if a request already exists
    const existingRequest = await ParticipationRequest.findOne({
      volunteer: volunteerId,
      opportunity: opportunityId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already submitted.' });
    }

    // Create a new participation request
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

app.put('/organization/requests/:id', verifyToken, async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  // Ensure the user making the request is an organization
  if (req.userRole !== 'organization') {
    return res.status(403).json({ message: 'Access forbidden: not an organization' });
  }

  try {
    // Find the request by ID and update its status
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

// يطلع status
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

// In index.js (backend)
app.get('/volunteer/request-status/:opportunityId', verifyToken, async (req, res) => {
  const { opportunityId } = req.params;
  
  try {
    const existingRequest = await ParticipationRequest.findOne({
      opportunity: opportunityId,
      volunteer: req.userId,
    });
    
    if (!existingRequest) {
      return res.json({ status: 'idle' }); // No request found
    }
    
    res.json({ status: existingRequest.status }); // Return the request status (e.g., 'pending', 'accepted', 'rejected')
  } catch (error) {
    console.error('Error fetching request status:', error);
    res.status(500).json({ message: 'Error fetching request status' });
  }
});


//*************************************************************************************************************************
//******************************** Volunteer Profile Route for User schema... ما نحتاجه لاننا فصلناه *********************   

// app.get('/volunteerprofile', verifyToken, async (req, res) => {
//   if (req.userRole !== 'volunteer') {
//     return res.status(403).json({ message: 'Access forbidden: not a volunteer' });
//   }

//   try {
//     const volunteer = await Volunteer.findById(req.userId);
//     if (!volunteer) {
//       return res.status(404).json({ message: 'Volunteer not found' });
//     }
//     res.json(volunteer);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching volunteer profile' });
//   }
// });

//*************************************************************************************************************************
//*********************************************** Edit Volunteer Profile for User schema... ما نحتاجه لانه قديم **********

// app.put('/volunteerprofile', verifyToken, async (req, res) => {
//   if (req.userRole !== 'volunteer') {
//     return res.status(403).json({ message: 'Access forbidden: not a volunteer' });
//   }
//   const { name, email, birthday, password } = req.body;

//   try {
//     const volunteer = await Volunteer.findById(req.userId);
//     if (!volunteer) {
//       return res.status(404).json({ message: 'Volunteer not found' });
//     }

//     volunteer.name = name || volunteer.name;
//     volunteer.email = email || volunteer.email;
//     volunteer.birthday = birthday || volunteer.birthday;

//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       volunteer.password = hashedPassword;
//     }

//     await volunteer.save();
//     res.json({ message: 'Profile updated successfully', volunteer });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating volunteer profile', error });
//   }
// });

//**************************************************************************************************

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
    console.log('Attempting to delete volunteer with ID:', req.userId);

    // البحث عن المتطوع وحذفه
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

// Update Volunteer Profile (City of Residence)


app.put('/volunteerprofile', verifyToken, async (req, res) => {
  try {
    // العثور على المتطوع باستخدام userId
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.userId,
      { city: req.body.city },
      { new: true, runValidators: true } // Return updated document and apply validation
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

// Fetch all opportunities (for volunteer)
app.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await Opportunity.find(); // Fetch all opportunities
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: 'Error fetching opportunities', error });
  }
});

