const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./App/db');
const { checkUid, findNameByUid, checkUidByEmailAndName, replaceUid } = require('./App/uid.js');
const { checkUserEmailInMongoDB, getUserEmailByUid } = require('./App/email.js');
const { uploadUser } = require('./App/auth.js');
const { createGroup, addMemberToGroup, findGroupNameByIdOrName, addUserToGroup } = require('./App/group.js');
const { addContact, provideUidforNames} = require('./App/contact.js');
const { fetchSenderAndReceiverUids } = require('./App/apicalls.js');
const setupWebSocketServer = require('./App/Socketuser.js');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectToMongoDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up WebSocket server
setupWebSocketServer(server);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



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
  try {
    const { oldUid, newUid } = req.body;
    const result = await replaceUid(oldUid, newUid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    const { groupId, memberIdentifier, groupUid } = req.body;
    const result = await addMemberToGroup(groupId, groupUid, memberIdentifier);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to check if a group name already exists
app.get('/api/findGroupNameByIdOrName', async (req, res) => {
  try {
    const { groupId, name } = req.query;
    const result = await findGroupNameByIdOrName(groupId, name);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to upload user details
app.post('/api/uploadUser', async (req, res) => {
  try {
    const { name, email, uid } = req.body;
    const result = await uploadUser(name, email, uid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Routes
app.post('/api/user/contact', async (req, res) => {
  const { uid, name, contactId } = req.body;
  
  // Log the inputs
  console.log('Received request with the following data:');
  console.log('UID:', uid);
  console.log('Name:', name);
  console.log('Contact ID:', contactId);

  if (!uid || !name || !contactId) {
    return res.status(400).json({ success: false, message: 'UID, name, and contactId are required' });
  }

  try {
    const result = await addContact(uid, name, contactId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Route to add a contact
app.post('/add-contact', async (req, res) => {
  const { uid, contactNames, contactIds, groupName, groupId } = req.body; // Add groupName and groupId here

  try {
    // Call the addContact function with provided parameters
    const result = await addContact(uid, contactNames, contactIds, groupName, groupId);

    // Send response based on the result of the addContact function
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch names based on UID
app.get('/fetch-names/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // Call the provideUidforNames function with the provided UID
    const names = await provideUidforNames(uid);

    // Send response with the fetched names
    res.status(200).json({ names });
  } catch (error) {
    console.error('Error fetching names:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint for adding a user to a group
app.post('/api/addUserToGroup', async (req, res) => {
  const { userUid, userName, groupUid } = req.body; // Assuming you send these parameters in the request body
  try {
    const result = await addUserToGroup(userUid, userName, groupUid);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Define a new route to fetch sender and receiver UIDs
app.get('/api/fetchSenderAndReceiverUids', (req, res) => {
  // Fetch sender and receiver UIDs
  fetchSenderAndReceiverUids()
    .then(({ senderUid, receiverUid }) => {
      // Send the sender and receiver UIDs as response
      res.status(200).json({ senderUid, receiverUid });
    })
    .catch((error) => {
      console.error('Error fetching sender and receiver UIDs:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


app.get('/api/getUserEmailByUid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await getUserEmailByUid(uid);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


