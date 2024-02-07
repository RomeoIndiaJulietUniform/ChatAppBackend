// uid.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
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

module.exports = {
  checkUid,
};
