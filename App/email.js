// email.js
const { connectToMongoDB } = require('./db'); // Import connectToMongoDB function from db.js
const { User } = require('./auth.js'); // Import the User model from auth.js

connectToMongoDB(); // Connect to MongoDB

// Function to check if user's email exists in MongoDB
const checkUserEmailInMongoDB = async (email) => {
  try {
    // Check if email exists in MongoDB
    const user = await User.findOne({ email });

    return { emailExists: Boolean(user) };
  } catch (error) {
    console.error(error);
    return { error: 'Internal server error' };
  }
};

module.exports = { checkUserEmailInMongoDB };
