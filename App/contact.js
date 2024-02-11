// contacts.js
const mongoose = require('mongoose');
const { User, uploadUser } = require('./auth');

// Define contact schema
const contactSchema = new mongoose.Schema({
  names: [String], // Array of names
  contactIds: [String], // Array of contact IDs
  uid: String,
  groupName: String, // Group name field
  groupId: String, // Group ID field
});

const Contact = mongoose.model('Contact', contactSchema);

// Function to create or update a contact in the database
const createOrUpdateContact = async (names, contactIds, uid, groupName, groupId) => {
  try {
    // Find existing contact with the given UID
    let existingContact = await Contact.findOne({ uid });

    if (existingContact) {
      // If contact with the given UID exists, update names, contactIds, groupName, and groupId
      existingContact.names = [...new Set(existingContact.names.concat(names))];
      existingContact.contactIds = [...new Set(existingContact.contactIds.concat(contactIds))];
      existingContact.groupName = groupName;
      existingContact.groupId = groupId;
      await existingContact.save();
      console.log('Contact updated successfully:', existingContact);
      return existingContact;
    } else {
      // If contact with the given UID does not exist, create a new contact
      const newContact = new Contact({ names, contactIds, uid, groupName, groupId });
      await newContact.save();
      console.log('Contact created successfully:', newContact);
      return newContact;
    }
  } catch (error) {
    console.error('Error creating or updating contact:', error);
    throw new Error('Error creating or updating contact');
  }
};

// Function to add contact to a user
const addContact = async (uid, contactNames, contactIds, groupName, groupId) => {
  try {
    console.log('Adding contact with the following details:');
    console.log('UID:', uid); // Logging the uid parameter

    // Upload the user if UID is provided
    if (uid) {
      // Pass uid as a parameter when uploading the user
      await uploadUser(null, null, uid);
    }

    console.log('Contact Names:', contactNames);
    console.log('Contact IDs:', contactIds);
    console.log('Group Name:', groupName);
    console.log('Group ID:', groupId);

    // Create or update a contact document with UID, groupName, and groupId
    await createOrUpdateContact(contactNames, contactIds, uid, groupName, groupId);

    // Find the user by UID
    const user = await User.findOne({ uid });
    if (!user) {
      console.log('User not found');
      return { success: false, message: 'User not found' };
    }

    console.log('Contact added successfully');
    return { success: true, message: 'Contact added successfully' };
  } catch (error) {
    console.error('Internal server error:', error);
    return { success: false, message: 'Internal server error' };
  }
};

// Function to fetch names based on UID
const provideUidforNames = async (uid) => {
  try {
    // Find the contact document with the given UID
    const contact = await Contact.findOne({ uid });

    console.log('Har Har Mahadev',uid);

    if (!contact) {
      console.log('Contact not found for UID:', uid);
      return [];
    }

    // Return the list of names associated with the contact
    return contact.names;
  } catch (error) {
    console.error('Error fetching names by UID:', error);
    throw new Error('Error fetching names by UID');
  }
};

module.exports = {
  addContact,
  provideUidforNames,
};
