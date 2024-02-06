// index.js
const express = require('express');
const cors = require('cors');
const { connectToMongoDB, uploadUser } = require('./App/auth.js');

const app = express();

connectToMongoDB();

app.use(cors());
app.use(express.json());

app.post('/api/uploadUser', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await uploadUser(name);

    if (result.success) {
      res.status(201).json({ message: result.message });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
