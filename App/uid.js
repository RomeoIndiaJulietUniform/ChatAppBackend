// uid.js
const { connectToMongoDB } = require('./db'); // Import connectToMongoDB function from db.js
const { User } = require('./auth.js'); // Import the User model from auth.js

connectToMongoDB(); // Connect to MongoDB

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

// Function to find name by UID
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
