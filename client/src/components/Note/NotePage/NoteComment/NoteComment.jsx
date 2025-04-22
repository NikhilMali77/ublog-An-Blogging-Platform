import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../../../authContext';
import axios from 'axios';
import authorPic from '../../../../assets/author.webp'

function NoteComment({ isOpen, onComment, noteId, onRequestClose, onReply, isReply, commentId }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [profile, setProfile] = useState(null);

  const onAddNote = async (e) => {
    e.preventDefault();
    if (!user) {
      console.log('User not authenticated');
      alert('Sign In to continue');
      navigate('/login');
      return;
    }

    const comment = {
      text: text,
    };

    if (isReply) {
      try {
        const response = await axios.post(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/comments/${commentId}`, comment);
        console.log('reply');
        setText('');
        onReply();
        
      } catch (error) {
        console.error('Error adding reply', error);
      }
    } else {
      try {
        const response = await axios.post(`https://ublog-ht6u.onrender.com/app/notes/${noteId}`, comment);
        console.log('Comment');
        setText('');
        onComment();
      } catch (error) {
        console.error('Error Adding comment:', error);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data);
        console.log('profile');
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };
    fetchUser();
  }, [user]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="New Comment"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>{isReply ? 'Reply' : 'New Comment'}</h2>
      {user ? (
        <>
          <div className="modal-header">
            <h2>{isReply ? 'Reply' : 'New note'}</h2>
            <button className="close-button" onClick={onRequestClose}>
              ×
            </button>
          </div>
          <form onSubmit={onAddNote}>
            <div className="modal-body">
              <div className="note-input">
                <img
                  src={
                    profile && profile.userAccount
                      ? profile.userAccount.profilePicture
                      : authorPic
                  }
                  alt="Avatar"
                  className="note-avatar"
                />
                <div className="note-input-fields">
                  <p>{user.username}</p>
                  <textarea
                    placeholder={isReply ? 'Add your reply' : 'Add your comment'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" disabled={!text.trim()}>
                Post
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2>Sign In first</h2>
        </>
      )}
    </Modal>
  );
}

export default NoteComment;
