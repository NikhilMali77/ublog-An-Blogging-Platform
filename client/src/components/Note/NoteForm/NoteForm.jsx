import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './note-form.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addNote } from '../../../Redux/noteSlice';
import { useAuth } from '../../../authContext';
import authorPic from '../../../assets/author.webp'

Modal.setAppElement('#root'); // This is important for accessibility

function NoteForm({ isOpen, onRequestClose }) {
  const { user } = useAuth();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/user/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    }
    fetchUser();
  },[ user])

  const onSubmit = async (e) => {
    e.preventDefault();
    const newNote = {
      text,
      createdAt: new Date().toISOString(),
      likeCount: 0,
    }
    try {
      // const response = await axios.post('https://ublog-ht6u.onrender.com/app/notes', newNote)
      const response = dispatch(addNote(newNote));
      toast.success('Note added!', {
        style: {
          backgroundColor: '#4caf50',
          color: '#fff',
          borderRadius: '8px',
          border: 'none'
        },
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
      setAuthor('');
      setText('');
      onRequestClose();
    }

    // const prof = ()=>{
    //   if(profile.userAccount.profilePicture)
    // }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="New Note"
      className="Modal"
      overlayClassName="Overlay"
    >
      {user && profile ? (
        <>
        <div className="modal-header">
        <h2>New note</h2>
        <button className="close-button" onClick={onRequestClose}>×</button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="note-input">
            <img src={ profile.userAccount && profile.userAccount.profilePicture ? profile.userAccount.profilePicture : authorPic} alt="Avatar" className="note-avatar" />
            <div className="note-input-fields">
              <p>{user.username}</p>
              <textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" disabled={!text.trim()}>Post</button>
        </div>
      </form></>
      ): (
        <>
        <h2>Sign In first</h2></>
      )}
    </Modal>
  );
}

export default NoteForm;
