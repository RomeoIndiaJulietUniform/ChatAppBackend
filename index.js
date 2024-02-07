// index.js
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./App/auth.js'); // Import the connectToMongoDB function
const { uploadUserWithDetails} = require('./App/auth.js'); // Import the uploadUser functions
const { checkUid,findNameByUid } = require('./App/uid.js');

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
