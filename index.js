const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./App/db');
const { checkUid, findNameByUid, checkUidByEmailAndName, replaceUid } = require('./App/uid.js');
const { checkUserEmailInMongoDB } = require('./App/email.js');
const { createGroup, addMemberToGroup, findGroupNameByIdOrName } = require('./App/group.js'); // Include findGroupNameByIdOrName
const app = express();

// Connect to MongoDB
connectToMongoDB();

// Middleware
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

// Endpoint to create a group
app.post('/api/createGroup', async (req, res) => {
  try {
    const { Name, memberEmails, groupUid } = req.body;
    const result = await createGroup(Name, memberEmails, groupUid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to add a member to a group
app.post('/api/addMemberToGroup', async (req, res) => {
  try {
    const { groupID, memberIdentifier, groupUid } = req.body;
    const result = await addMemberToGroup(groupID, groupUid, memberIdentifier);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to check if a group name already exists
app.get('/api/findGroupNameByIdOrName', async (req, res) => { // Changed the endpoint
  try {
    const { groupId, name } = req.query; // Changed parameters
    const result = await findGroupNameByIdOrName(groupId, name); // Changed function call
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
