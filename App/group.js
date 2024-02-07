// group.js
const { User } = require('./auth');

// Define Group model
const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  Name: String,
  memberNames: [String],
  groupID: String,
  memberEmails: [String],
  memberCount: Number
});
const Group = mongoose.model('Group', groupSchema);

// Function to create a new group
const createGroup = async (Name, memberEmails) => {
    try {
      // Find user objects for given emails
      const members = await User.find({ email: { $in: memberEmails } });
      console.log('Members:', members);
      
      // Create new group with provided name and members
      const newGroup = new Group({
        Name: Name,
        memberNames: members.map(member => member.name), // Store only user names in the group
        groupID: new mongoose.Types.ObjectId().toString(), // Generate a new group ID
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
  

// Function to add a member to a group
const addMemberToGroup = async (groupID, memberEmail) => {
  try {
    // Find user object for given email
    const member = await User.findOne({ email: memberEmail });
    console.log('Member:', member);
    if (!member) {
      return { success: false, message: 'Member not found with the provided email' };
    }

    // Find group and add member to its members array
    const group = await Group.findOne({ groupID: groupID });
    console.log('Group:', group);
    if (!group) {
      return { success: false, message: 'Group not found' };
    }

    // Check if the member is already in the group
    if (group.memberEmails.includes(memberEmail)) {
      return { success: false, message: 'Member is already in the group' };
    }

    // Add member to group
    group.memberNames.push(member.name);
    group.memberEmails.push(memberEmail);
    group.memberCount++;
    await group.save();
    console.log('Member added to group successfully');

    return { success: true, message: 'Member added to group successfully', group };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add member to group', error: error.message };
  }
};

module.exports = {
  createGroup,
  addMemberToGroup
};
