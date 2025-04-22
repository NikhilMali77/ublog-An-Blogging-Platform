import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the UserAccountSchema
const UserAccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profilePicture: {
    type: String, // URL to the profile picture
    default: ''   // Default value if no picture is provided
  },
  description: {
    type: String,
    default: ''   // Default value if no description is provided
  },
  subscribers: [{
    type:  Schema.Types.ObjectId,
    ref: 'User',
    default: ''
  }],
  savedBlogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  savedNotes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

// Create models from the schemas
const UserAccount = mongoose.model('UserAccount', UserAccountSchema);
export default UserAccount;
