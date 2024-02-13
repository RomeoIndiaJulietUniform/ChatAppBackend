// contacts.js
const mongoose = require('mongoose');
const { User, uploadUser } = require('./auth');

// Define contact schema
const contactSchema = new mongoose.Schema({
  contacts: [[{ name: String, id: String }]], // Array of 2D arrays containing name and ID
  uid: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Function to create or update a contact in the database
const createOrUpdateContact = async (contacts, uid) => {
  try {
    // Find existing contact with the given UID
    let existingContact = await Contact.findOne({ uid });

    if (existingContact) {
      // If contact with the given UID exists, update contacts
      existingContact.contacts = existingContact.contacts.concat([contacts]);
      await existingContact.save();
      console.log('Contact updated successfully:', existingContact);
      return existingContact;
    } else {
      // If contact with the given UID does not exist, create a new contact
      const newContact = new Contact({ contacts: [contacts], uid });
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
const addContact = async (uid, contactName, contactId) => {
  try {
    console.log('Adding contact with the following details:');
    console.log('UID:', uid); // Logging the uid parameter

    // Upload the user if UID is provided
    if (uid) {
      // Pass uid as a parameter when uploading the user
      await uploadUser(null, null, uid);
      console.log('User uploaded successfully:', uid);
    }

    console.log('Contact Name:', contactName);
    console.log('Contact ID:', contactId);

    // Create or update a contact document with UID
    await createOrUpdateContact([{ name: contactName, id: contactId }], uid);

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
const provideUidforNames = async (uid) => {
  try {
    console.log('Fetching names for UID:', uid);

    // Find the contact document with the given UID
    const contact = await Contact.findOne({ uid });

    if (!contact) {
      console.log('Contact not found for UID:', uid);
      return [];
    }

    // Extract names and associated UIDs from the 2D array
    const namesWithUid = contact.contacts.flatMap(contactArray => 
      contactArray.map(contact => ({ name: contact.name, uid: contact.id }))
    );
    console.log('Names with UIDs fetched successfully:', namesWithUid);
    return namesWithUid;
  } catch (error) {
    console.error('Error fetching names by UID:', error);
    throw new Error('Error fetching names by UID');
  }
};

module.exports = {
  addContact,
  provideUidforNames,
};
