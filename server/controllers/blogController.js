import Blog from "../models/blogSchema.js";
import User from "../models/userSchema.js";
import UserAccount from "../models/userAccount.js";

export const addBlog = async (req, res) => {
  const { title, imageURL, content } = req.body;
  const newBlog = new Blog({
    author: req.user._id,
    title,
    imageURL, // No need to change this if it's handled properly
    content
  });

  try {
    const savedBlog = await newBlog.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { blogs: savedBlog._id }
    });
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error adding blog', error });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find({})
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'author',
      })
      .populate({
        path: 'comments.user',
      });

    // Randomize the blogs after fetching them
    blogs.sort(() => Math.random() - 0.5);

    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId).populate('author');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
export const updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const {title, imageURL, content} = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {title, imageURL, content},
      {new: true}
    )
    if(!blog) return res.status(404).json({message: 'No blog found'})
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
}

export const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const deletePost = await Blog.findByIdAndDelete(blogId);
    if (!deletePost) {
      return res.status(404).json({ message: 'Post not found' })
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { blogs: deletePost._id }
    })
    await UserAccount.updateMany(
      { savedBlogs: blogId },
      { $pull: { savedBlogs: blogId } }
    );
    res.status(201).json({ message: 'Deleted Blog' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const addBlogComment = async (req,res) => {
  const  {blogId} = req.params;
  const userId = req.user._id;
  const {text} = req.body;
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const blog = await Blog.findById(blogId)
    if(!blog){
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = {
      user: user._id,
      username: user.username,
      text
    }
    blog.comments.push(comment)
    await blog.save()
    res.status(200).json(comment)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteBlogComment = async (req,res) => {
  const {blogId, commentId} = req.params;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const blog = await Blog.findById(blogId)
    if(!blog){
      return res.status(404).json({ message: 'Blog not found' });
    }
    const comment = blog.comments.filter(c => String(c._id) === String(commentId))
    if(!comment) return res.status(404).json({message: 'No comment found'})

    blog.comments = blog.comments.filter(c => String(c._id) !== String(commentId))
    const updatedBlog = await blog.save()
    res.status(200).json(updatedBlog)
  } catch (error) {
    res.status(500).json({message: 'Server Error'})
  }
}