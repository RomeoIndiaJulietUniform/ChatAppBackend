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

// Function to replace UID with a new UID
const replaceUid = async (oldUid, newUid) => {
  try {
    console.log('Replacing UID:', oldUid, 'with new UID:', newUid);

    // Find the user with the old UID
    const user = await User.findOne({ uid: oldUid });

    if (user) {
      // Update the UID with the new UID
      user.uid = newUid;
      await user.save();
      console.log('UID replaced successfully.');
      return { success: true };
    } else {
      console.log('No user found with UID:', oldUid);
      return { success: false, error: 'No user found with the old UID' };
    }
  } catch (error) {
    console.error('Error replacing UID:', error);
    return { success: false, error: 'Internal server error' };
  }
};

// Function to check UID based on email and name
const checkUidByEmailAndName = async (email, name) => {
  try {
    // Check if user exists in MongoDB with the given email and name
    const user = await User.findOne({ email, name });

    if (user) {
      console.log('User found with email:', email, 'and name:', name);
      return { uid: user.uid };
    } else {
      console.log('No user found with email:', email, 'and name:', name);
      return { uid: null };
    }
  } catch (error) {
    console.error('Error checking UID by email and name:', error);
    return { error: 'Internal server error' };
  }
};

module.exports = {
  checkUid,
  findNameByUid,
  replaceUid,
  checkUidByEmailAndName,
};
