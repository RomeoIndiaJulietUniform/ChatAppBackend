const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

app.post('/api/uploadUser', async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = new User({ name });
    await newUser.save();

    res.status(201).json({ message: 'User uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
