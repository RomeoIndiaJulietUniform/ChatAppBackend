const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./App/db');
const { uploadUserWithDetails } = require('./App/auth.js');
const { checkUid, findNameByUid, checkUidByEmailAndName } = require('./App/uid.js');
const { checkUserEmailInMongoDB } = require('./App/email.js');
const { replaceUid } = require('./App/uid.js'); // Import the replaceUid function from uid.js

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

// Endpoint to check if user's email exists
app.get('/api/checkUserEmail/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await checkUserEmailInMongoDB(email);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to find name by UID
app.get('/api/findNameByUid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await findNameByUid(uid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to check UID based on email and name
app.get('/api/checkUidByEmailAndName', async (req, res) => {
  try {
    const { email, name } = req.query;
    const result = await checkUidByEmailAndName(email, name);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to replace UID
app.put('/api/replaceUid', async (req, res) => {
  const { oldUid, newUid } = req.body;
  const result = await replaceUid(oldUid, newUid);
  res.json(result);
});

// Upload user route
app.post('/api/uploadUser', async (req, res) => {
  const { name, email, uid } = req.body;
  const result = await uploadUserWithDetails(name, email, uid);
  res.json(result);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
