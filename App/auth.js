// auth.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongoDB = () => {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
};

const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model('User', userSchema);

const uploadUser = async (name) => {
  try {
    const newUser = new User({ name });
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
