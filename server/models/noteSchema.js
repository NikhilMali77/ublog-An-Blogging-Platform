import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const noteSchema = Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  likeCount: {
    type: Number,
  },
  comments: [{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
    likes: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }],
    likeCount: {
      type: Number,
    },
    replies: [{
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
      likes: [{
       type: mongoose.Schema.Types.ObjectId, ref: 'User' 
      }],
      likeCount: {
        type: Number,
      },
    }]
  }],
  saves : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Note = mongoose.model('Note', noteSchema)
export default Note;