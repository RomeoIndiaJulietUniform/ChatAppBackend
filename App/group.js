// group.js
const { User } = require('./auth');

// Define Group model
const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  Name: String,
  memberNames: [String],
  groupID: String,
  groupUid: String, // Adding groupUid field
  memberEmails: [String],
  memberCount: Number
});
const Group = mongoose.model('Group', groupSchema);

// Function to create a new group
const createGroup = async (Name, memberEmails, groupUid) => { // Adding groupUid parameter
  try {
    // Find user objects for given emails
    const members = await User.find({ email: { $in: memberEmails } });
    console.log('Members:', members);
    
    // Create new group with provided name, members, and groupUid
    const newGroup = new Group({
      Name: Name,
      memberNames: members.map(member => member.name),
      groupID: new mongoose.Types.ObjectId().toString(),
      groupUid: groupUid, // Assigning provided groupUid
      memberEmails: memberEmails,
      memberCount: members.length
    });
    console.log('New Group:', newGroup);
    await newGroup.save();
    console.log('Group saved successfully');
    
    return { success: true, message: 'Group created successfully', group: newGroup };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create group', error: error.message };
  }
};

// Function to add a member to a group by email or UID
const addMemberToGroup = async (groupID, groupUid, memberIdentifier) => {
  try {
    let member;
    // Check if memberIdentifier is an email or UID
    if (memberIdentifier.includes('@')) {
      // If memberIdentifier contains '@', consider it as an email
      member = await User.findOne({ email: memberIdentifier });
    } else if (memberIdentifier.length === 16) {
      // If memberIdentifier length is 12, treat it as a UID
      member = await User.findOne({ uid: memberIdentifier });
    } else {
      // Otherwise, invalid memberIdentifier format
      return { success: false, message: 'Invalid member identifier format' };
    }

    console.log('Member:', member);
    if (!member) {
      return { success: false, message: 'Member not found with the provided email or UID' };
    }

    // Find group and add member to its members array
    const group = await Group.findOne({ groupID: groupID, groupUid: groupUid });
    console.log('Group:', group);
    if (!group) {
      return { success: false, message: 'Group not found' };
    }

    // Check if the member is already in the group
    if (group.memberEmails.includes(member.email) || group.memberNames.includes(member.name)) {
      return { success: false, message: 'Member is already in the group' };
    }

    // Add member to group
    group.memberNames.push(member.name);
    group.memberEmails.push(member.email);
    group.memberCount++;
    await group.save();
    console.log('Member added to group successfully');

    return { success: true, message: 'Member added to group successfully', group };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add member to group', error: error.message };
  }
};


// Function to find group's name by groupUid or name
const findGroupNameByIdOrName = async (groupUid, groupName) => {
  try {
    console.log('Received groupUid:', groupUid); // Log the received groupUid
    // Find group by groupUid or groupName
    let group;
    if (groupUid) {
      group = await Group.findOne({ groupUid: groupUid });
    } else if (groupName) {
      group = await Group.findOne({ Name: groupName });
    }

    // If group found, return its name and log it
    if (group) {
      console.log('Found group name:', group.Name);
      return { success: true, groupName: group.Name };
    } else {
      // If no group found, return error message
      return { success: false, message: 'Group not found' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to find group', error: error.message };
  }
};



module.exports = {
  createGroup,
  addMemberToGroup,
  findGroupNameByIdOrName
};
