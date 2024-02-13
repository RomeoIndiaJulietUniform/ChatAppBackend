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
const findNameByUid = async (input) => {
  try {
    console.log('Finding name by input:', input);
    let user;

    if (input.includes('@')) {
      // If input contains '@', it's likely an email
      user = await User.findOne({ email: input });
    } else if (input.length === 16) {
      // If input is 24 characters long, it's likely a UID
      user = await User.findOne({ uid: input });
    } else {
      // Otherwise, treat it as a name
      user = await User.findOne({ name: input });
    }

    if (user) {
      console.log('Found name:', user.name);
      return { name: user.name };
    } else {
      console.log('No user found with input Bravo 6:', input);
      return { name: null };
    }
  } catch (error) {
    console.error('Error finding name by input:', error);
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
