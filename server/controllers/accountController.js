import UserAccount from "../models/userAccount.js"
import User from "../models/userSchema.js";
import Blog from '../models/blogSchema.js';
import Note from '../models/noteSchema.js';

export const addUserAccount = async (req, res) => {
  const { profilePicture, description } = req.body;
  const userId = req.user._id;

  try {
    const existingUser = await UserAccount.findOne({ user: userId })
    if (existingUser) {
      return res.status(400).json({ message: 'User exists' });
    }
    const account = new UserAccount({
      profilePicture,
      description,
      user: userId
    })
    await account.save()
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { userAccount: account._id } }, // Add new userAccount ID to userAccount array (using $addToSet to avoid duplicates)
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(201).json(account);
  } catch (error) {
    console.error('Error creating new user account:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
}

export const fetchUserAccount = async (req, res) => {
  const userId = req.user._id;
  try {
    const userAccount = await UserAccount.findOne({ user: userId })
    .populate('user')
    // .populate(
    //   path: 'savedBlogs'
    // );
    const blogs = await Blog.find({ author: userId }).populate('author');
    const notes = await Note.find({ author: userId });

    if (!userAccount) {
      return res.status(404).json({ message: "No account found" });
    }
    const userProfile = {
      user: userAccount.user,
      userAccId: userAccount._id,
      profilePic: userAccount.profilePicture,
      description: userAccount.description,
      savedBlogs: userAccount.savedBlogs,
      savedNotes: userAccount.savedNotes,
      blogs,
      notes,
      numberOfBlogs: blogs.length,
      numberOfNotes: notes.length,
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const fetchUserAccountById = async (req, res) => {
  const {userId} = req.params;
  try {
    const userAccount = await UserAccount.findOne({ user: userId })
    .populate('user')
    const blogs = await Blog.find({ author: userId }).populate('author');
    const notes = await Note.find({ author: userId });

    if (!userAccount) {
      return res.status(404).json({ message: "No account found" });
    }
    const userProfile = {
      user: userAccount.user,
      userAccId: userAccount._id,
      profilePic: userAccount.profilePicture,
      description: userAccount.description,
      savedBlogs: userAccount.savedBlogs,
      savedNotes: userAccount.savedNotes,
      blogs,
      notes,
      numberOfBlogs: blogs.length,
      numberOfNotes: notes.length,
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateUserAccount = async(req, res) => {
  const userId = req.user._id;
  const {profilePicture, description} = req.body;
  try {
    const updateUserAccount = await UserAccount.findOneAndUpdate(
      {user: userId},
      {profilePicture, description },
      { new: true }
      );
    if(!updateUserAccount){
      return res.status(404).json({message: 'No Account found'});
    }
    res.status(200).json(updateUserAccount);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const saveBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;
  try {
    const userAccount = await UserAccount.findOne({user: userId});
    const blog = await Blog.findById(blogId);
    if(!userAccount){
      return res.status(404).json({ message: 'User account not found' });
    }
    if(!userAccount.savedBlogs.includes(blogId)) {
      userAccount.savedBlogs.push(blogId);
      await userAccount.save();
      blog.saves.push(userId);
      await blog.save();
    }
    res.status(200).json({userAccount, blog});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const unsaveBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const userAccount = await UserAccount.findOne({ user: userId });
    const blog = await Blog.findById(blogId);

    if (!userAccount) {
      return res.status(404).json({ message: 'User account not found' });
    }

    // Filter out the blogId from savedBlogs array
    userAccount.savedBlogs = userAccount.savedBlogs.filter(savedBlog => savedBlog.toString() !== blogId);

    // Filter out the userId from the saves array in blog
    blog.saves = blog.saves.filter(savedUser => savedUser.toString() !== userId.toString());

    // Save the updated userAccount and blog
    await userAccount.save();
    await blog.save();

    // Respond with success message and updated data
    res.status(200).json({ message: 'Blog unsaved successfully', userAccount, blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;
  try {
    const userAccount = await UserAccount.findOne({user: userId});
    const note = await Note.findById(noteId);
    if(!userAccount){
      return res.status(404).json({ message: 'User account not found' });
    }
    if(!userAccount.savedNotes.includes(noteId)) {
      userAccount.savedNotes.push(noteId);
      await userAccount.save();
      note.saves.push(userId);
      await note.save();
    }
    res.status(200).json({userAccount, note});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const unsaveNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const userAccount = await UserAccount.findOne({ user: userId });
    const note = await Note.findById(noteId);

    if (!userAccount) {
      return res.status(404).json({ message: 'User account not found' });
    }

    // Filter out the blogId from savedBlogs array
    userAccount.savedNotes = userAccount.savedNotes.filter(savedNote => savedNote.toString() !== noteId);

    // Filter out the userId from the saves array in blog
    note.saves = note.saves.filter(savedUser => savedUser.toString() !== userId.toString());

    // Save the updated userAccount and blog
    await userAccount.save();
    await note.save();

    // Respond with success message and updated data
    res.status(200).json({ message: 'Blog unsaved successfully', userAccount, note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};