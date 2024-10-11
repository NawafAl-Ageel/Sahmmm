const mongoose = require('mongoose');

mongoose.connect('mongodb', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;
