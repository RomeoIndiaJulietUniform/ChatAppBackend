// backend/routes/messages.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
  concatenatedIds: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isReceived: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a Message model
const Message = mongoose.model('Message', messageSchema);

// Function to upload received or sent message
const uploadMessage = async (concatenatedIds, message, isReceived) => {
  try {
    const newMessage = new Message({
      concatenatedIds,
      message,
      isReceived
    });
    await newMessage.save();
    console.log('Message received and stored successfully');
  } catch (error) {
    console.error('Error uploading message:', error);
  }
};

// Function to fetch received or sent messages sorted by timestamp
const fetchMessages = async (concatenatedIds) => {
  try {
    const messages = await Message.find({ concatenatedIds }).sort({ timestamp: 1 });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};


// Export the functions
module.exports = { uploadMessage, fetchMessages };
