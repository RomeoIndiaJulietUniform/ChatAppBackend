// uid.js
const mongoose = require('mongoose');
const User = require('./auth.js').User; // Import the User model from auth.js
require('dotenv').config();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Function to check if UID is present
const checkUid = async (uid) => {
  try {
    // Check if UID exists in MongoDB
    const user = await User.findOne({ uid });

    return { uidExists: Boolean(user) };
  } catch (error) {
    console.error(error);
    return { error: 'Internal server error' };
  }
};

// No need to use MongoClient directly for this function
const findNameByUid = async (uid) => {
  try {
    console.log('Finding name by UID:', uid);
    const user = await User.findOne({ uid });

    if (user) {
      console.log('Found name:', user.name);
      return { name: user.name };
    } else {
      console.log('No user found with UID:', uid);
      return { name: null };
    }
  } catch (error) {
    console.error('Error finding name by UID:', error);
    throw error;
  }
};

module.exports = {
  checkUid,
  findNameByUid,
};
