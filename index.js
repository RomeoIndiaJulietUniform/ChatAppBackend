// index.js
const express = require('express');
const cors = require('cors');
const { connectToMongoDB, uploadUser } = require('./App/auth.js');
const { checkUid } = require('./App/uid.js');

const app = express();

connectToMongoDB();

app.use(cors());
app.use(express.json());

// Endpoint to check if UID is present
app.get('/api/checkUid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await checkUid(uid);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to upload user data
app.post('/api/uploadUser', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await uploadUser(name, email);

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
