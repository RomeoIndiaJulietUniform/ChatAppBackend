// auth.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = () => {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};

const userSchema = new mongoose.Schema({
  name: String,
  email: String, // Add email field to the schema
});

const User = mongoose.model('User', userSchema);

const uploadUser = async (name, email) => {
  try {
    const newUser = new User({ name, email }); // Include email in the User creation
    await newUser.save();
    return { success: true, message: 'User uploaded successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal server error' };
  }
};

module.exports = {
  connectToMongoDB,
  uploadUser,
};
