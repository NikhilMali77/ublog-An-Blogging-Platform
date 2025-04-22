import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
  type: String,
  required: true 
  },
  notes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  },
  blogs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount'
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
export default User;
