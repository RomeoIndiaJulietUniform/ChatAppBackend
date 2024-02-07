// auth.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = () => {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  uid: String,
});

const User = mongoose.model('User', userSchema);

// Temporary storage for user data without UID
let userPendingUid = null;

// Upload user with name, email, and UID
const uploadUserWithDetails = async (name, email, uid) => {
  try {
    if (uid) {
      // If UID is provided, upload the user with all data
      if (userPendingUid) {
        // If there was pending data, upload it along with the UID
        const { name: pendingName, email: pendingEmail } = userPendingUid;
        const newUser = new User({ name: pendingName, email: pendingEmail, uid });
        await newUser.save();
        userPendingUid = null; // Clear pending data after upload
        return { success: true, message: 'User uploaded successfully' };
      } else {
        // If there was no pending data, simply update the existing user
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          existingUser.uid = uid;
          await existingUser.save();
          return { success: true, message: 'User updated successfully' };
        } else {
          console.error('No pending user data found.');
          return { success: false, message: 'No pending user data found' };
        }
      }
    } else {
      // If UID is not provided, hold the data until UID is received
      userPendingUid = { name, email };
      return { success: true, message: 'User data received, waiting for UID' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error' };
  }
};

module.exports = {
  connectToMongoDB,
  uploadUserWithDetails
};
