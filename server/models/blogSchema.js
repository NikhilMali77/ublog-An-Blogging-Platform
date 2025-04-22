import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogSchema = Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  saves : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments:[{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    text: String,
  }]
})

const Blog = mongoose.model('Blog', blogSchema)
export default Blog;