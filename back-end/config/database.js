const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Hamad:12345@sahem.oqoxx.mongodb.net/?retryWrites=true&w=majority&appName=Sahem', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;
