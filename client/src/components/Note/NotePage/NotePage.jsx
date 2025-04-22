import React, { useEffect, useState } from 'react';
import './notepage.css';
import { useDispatch } from 'react-redux';
import { deleteNote } from '../../../Redux/noteSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../authContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import NoteComment from './NoteComment/NoteComment';
import authorPic from '../../../assets/author.webp'

function NotePage() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [viewComments, setViewComments] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const { user } = useAuth()
  const [liked, setLiked] = useState(false);
  const [commentLiked, setCommentLiked] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/notes/${noteId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNote(response.data);
        setLiked(response.data.likes.includes(user.userId));
        //Creating an object which will store boolean values of each comment either true or false
        const initialLikedState = {};
        response.data.comments.forEach(comment => {
          // comment._id is the key 
          initialLikedState[comment._id] = comment.likes.includes(user.userId)
        });
        setCommentLiked(initialLikedState)
      } catch (error) {
        console.error('Error fetching note', error);
      }
    };

    const fetchUser = async (authorId) => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/user/${authorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    if (noteId) {
      fetchNote();
    }

    if (note && note.author) {
      fetchUser(note.author._id);
    }
  }, [noteId, note]);

  const handleNoteLike = async (e) => {
    // e.stopPropagation()
    try {
      const response = await axios.patch(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/like`);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  }
  const handleCommentLike = async (commentId) => {
    // e.stop
    try {
      const response = await axios.patch(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/${commentId}/like`);
      setCommentLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  }
  const handleCommentOpenModal = () => {
    setActiveCommentId(null);
    setIsCommentModalOpen(true);
  };

  const handleCommentCloseModal = () => {
    setIsCommentModalOpen(false);
  };
  const handleOpenReplyModal = (commentId) => {
    setActiveCommentId(commentId);
    setIsReplyModalOpen(true);
  }
  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
  }
  const onAddComment = () => {
    setIsCommentModalOpen(false);
  };
  const onAddReply = () => {
    setIsReplyModalOpen(false);
  }
  const toggleComments = (commentId) => {
    setViewComments((prevViewComments) => ({
      ...prevViewComments,
      [commentId]: !prevViewComments[commentId]
    }
    ))
  }
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNote(prevNote => ({
        ...prevNote,
        comments: prevNote.comments.filter(comment => comment._id !== commentId)
      }));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await axios.delete(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/comments/${commentId}/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNote(prevNote => ({
        ...prevNote,
        comments: prevNote.comments.map(comment => 
          comment._id === commentId
            ? { ...comment, replies: comment.replies.filter(reply => reply._id !== replyId) }
            : comment
        )
      }));
    } catch (error) {
      console.error('Error deleting reply', error);
    }
  };
  const handleDeleteNote = async () => {
    try {
      await dispatch(deleteNote(noteId)).unwrap();
      navigate(-1);
      // Optionally show a toast notification here
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };
  if (!note) return <div>Loading...</div>;

  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true });

  return (
    <div className="cont">
      <div className="note-view">
        <div className="note-header">
          <img
            src={profile?.userAccount?.profilePicture || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='}
            alt={note.author.username}
            className="note-avatar"
          />
          <div className="note-author-details">
            <h3>{note.author.username}</h3>
            <span>{timeAgo.replace('about', '')}</span>
          </div>
        </div>
        <div className="note-content">
          <p className='noteText'>{note.text}</p>
        </div>
        {user && (user.userId === note.author._id) && (
          <button className='del' onClick={handleDeleteNote}>Delete Note</button>
        )}
        <div className="note-footer">
          <div className="like">
            <span className='likeBtn' onClick={handleNoteLike}>
              {liked ? <FontAwesomeIcon style={{ color: 'red' }} icon={faHeart} /> : <FontAwesomeIcon style={{ color: 'white' }} icon={faHeart} />}
            </span>
            <span className='likeCount'>{note.likeCount}</span>
          </div>
          <span className='cmtIcon' onClick={handleCommentOpenModal}><FontAwesomeIcon icon={faComment} /></span>
          <NoteComment
            isOpen={isCommentModalOpen}
            onRequestClose={handleCommentCloseModal}
            onComment={onAddComment}
            noteId={noteId}
            isReply={false}
          />
        </div>
        <div className="note-comments">
          {note.comments.length > 0 && <h2>Replies</h2>}
          <div className="comment">
            {note.comments.map(comment => (
              <div className="maincomment" key={comment._id}>
                <div className="cmt-details">
                  <img src={comment.user?.userAccount?.profilePicture || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt="" />
                  <p><strong>{comment.username}</strong></p>
                </div>
                <p className='cntnt1'>{comment.text}</p>
                <div className="cmt-footer">
                  <div className="like">
                    <span onClick={() => handleCommentLike(comment._id)}>
                      {commentLiked[comment._id] ? <FontAwesomeIcon style={{ color: 'red' }} icon={faHeart} /> : <FontAwesomeIcon style={{ color: 'white' }} icon={faHeart} />}
                    </span>
                    <span>{comment.likeCount}</span>
                  </div>
                  <span className='cmtIcon' onClick={() => handleOpenReplyModal(comment._id)}>
                    <FontAwesomeIcon icon={faComment} />
                  </span>
                  {(user && (user.userId === comment.user._id || user.userId === note.author._id)) && (
                    <button className='del' onClick={() => handleDeleteComment(comment._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete Comment
                  </button>
                  )}
                  {comment.replies.length > 0 && (
                    <p className='replyBtn' onClick={() => toggleComments(comment._id)}>
                      {viewComments[comment._id] ? 'Hide Replies' : 'View Replies'}
                    </p>
                  )}
                  <NoteComment
                    isOpen={isReplyModalOpen}
                    onRequestClose={handleCloseReplyModal}
                    onReply={onAddReply}
                    noteId={noteId}
                    isReply={true}
                    commentId={activeCommentId}
                  />
                </div>
                {viewComments[comment._id] && comment.replies.map(reply => (
                  <div key={reply._id} className="reply">
                    <div className="reply-details">
                      <img src={reply.user?.userAccount?.profilePicture || authorPic} alt="" />
                      <p><strong>{reply.username}</strong></p>
                    </div>
                    <p className='cntnt2'>{reply.text}</p>
                    {(user && (user.userId === reply.user._id || user.userId === note.author._id)) && (
                      <button className='del' onClick={() => handleDeleteReply(comment._id, reply._id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete Reply
                    </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotePage;