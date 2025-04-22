import Blog from '../models/blogSchema.js';
import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await User.create({
      username, password, email
    });
    const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.SESSION_SECRET, { expiresIn: '3d' });
    res.status(201).json({ message: 'User created', token })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}


export const userLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Authentication failed' });
    }
    const token = jwt.sign(
      { userId: req.user._id, username: req.user.username },
      process.env.SESSION_SECRET,
      { expiresIn: '3d' }
    );
    res.json({ token, user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const fetchUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('userAccount');
    if (!user) {
      return res.status(404).json({ message: 'No User found' })
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}
export const searchRoute = async (req,res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ username: { $regex: `^${query}`, $options: 'i' }}).populate('userAccount');
    const blogs = await Blog.find({ title: { $regex: `^${query}`, $options: 'i' }})
    .populate({
      path : 'author',
      populate: {path: 'userAccount'}
    });
    res.status(200).json({users, blogs});
  } catch (error) {
    res.status(500).json({message: 'Server error'});
  }
}