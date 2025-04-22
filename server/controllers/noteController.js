import Note from "../models/noteSchema.js";
import User from "../models/userSchema.js";
import UserAccount from "../models/userAccount.js";

export const addNote = async (req, res) => {
  const { text } = req.body;
  const note = new Note({
    author: req.user._id,
    text,
    createdAt: new Date().toISOString(),
  });
  try {
    const newNote = await note.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { notes: newNote._id }
    })
    res.status(201).json(newNote)
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
}

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate('author');
    res.status(200).json(notes)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId).populate('author')
    .populate(
      {
        path: 'comments.user',
        populate: {path: 'userAccount'}
      }
    )
    .populate(
      {
        path: 'comments.replies.user',
        populate: {path: 'userAccount'}
      }
    )
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const deleteNote = await Note.findByIdAndDelete(noteId);
    if (!deleteNote) {
      return res.status(404).json({ message: 'Note not found' })
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {notes: deleteNote._id}
    })
    await UserAccount.updateMany(
      { savedNotes: noteId },
      { $pull: { savedNotes: noteId } }
    );
    res.status(201).json({ message: 'Deleted Note' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const addComment = async (req,res) => {
  const userId = req.user._id;
  const {text} = req.body;
  try {
    const user = await User.findById(userId);
    if(!user){
       return res.status(404).json({ message: 'User not found' });
    }
    const note = await Note.findById(req.params.noteId);
    if(!note){
      return res.status(404).json({ message: 'Note not found' });
    }
    const comment = {
      user: user._id,
      username: user.username,
      text
    } 
    note.comments.push(comment);
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const addCommentReply = async (req,res) => {
  const userId = req.user._id;
  const commentId = req.params.commentId;
  const {text} = req.body;
  try {
    const user = await User.findById(userId);
    if(!user){
       return res.status(404).json({ message: 'User not found' });
    }
    const note = await Note.findById(req.params.noteId);
    if(!note){
      return res.status(404).json({ message: 'Note not found' });
    }
    const comment = note.comments.find(c => c._id.equals(commentId));
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const reply = {
      user: user._id,
      username: user.username,
      text
    } 
    comment.replies.push(reply);
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export const likeNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    const index = note.likes.findIndex(id => String(id) === String(userId));

    if (index === -1) {
      // Like the post
      note.likes.push(userId);
    } else {
      // Unlike the post
      note.likes = note.likes.filter(id => String(id) !== String(userId));
    }

    note.likeCount = note.likes.length;
    const updatedNote = await note.save();
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  const { noteId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    const comment = note.comments.find(c => String(c._id) === String(commentId));
    if(!comment) return res.status(404).json({message: 'No Comment Found'});

    const index = comment.likes.findIndex(id => String(id) === String(userId));

    if (index === -1) {
      // Like the post
      comment.likes.push(userId);
    } else {
      // Unlike the post
      comment.likes = comment.likes.filter(id => String(id) !== String(userId));
    }

    comment.likeCount = comment.likes.length;
    const updatedNote = await note.save();
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { noteId, commentId } = req.params;

  try {
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    const commentIndex = note.comments.findIndex(c => c._id.equals(commentId));

    if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });

    note.comments.splice(commentIndex, 1);
    await note.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  const { noteId, commentId, replyId } = req.params;

  try {
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ message: 'Note not found' });

    const comment = note.comments.id(commentId);
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const replyIndex = comment.replies.findIndex(r => r._id.equals(replyId));

    if (replyIndex === -1) return res.status(404).json({ message: 'Reply not found' });

    comment.replies.splice(replyIndex, 1);
    await note.save();

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
