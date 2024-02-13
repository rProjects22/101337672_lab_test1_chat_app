const mongoose = require('mongoose');
const config = require('./config');

async function connectToDatabase() {
  try {
    // Connect to MongoDB using the URI from config.js
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectToDatabase;
