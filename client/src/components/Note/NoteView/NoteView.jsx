import React, { useContext, useEffect, useState } from 'react';
import './note-view.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../authContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import lightModeContext from '../../../lightModeContext';
import authorPic from '../../../assets/author.webp'

function NoteView({ noteId, showSaveIcon }) {
  const id = noteId;
  const [note, setNote] = useState(null);
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();
  const { lightMode } = useContext(lightModeContext)
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      const response = await axios.patch(`https://ublog-ht6u.onrender.com/app/notes/${noteId}/like`);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  }
  useEffect(() => {
    const fetchNote = async (e) => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/notes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setNote(response.data);
        if (user) {
          setLiked(response.data.likes.includes(user.userId));
          setSaved(response.data.saves.includes(user.userId))
        }
      } catch (error) {
        console.error('Error fetching note', error);
      }
    };
    fetchNote();
  }, [id, liked]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/user/${note.author._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };
    fetchUser();
  }, [note]);

  

  const openNote = () => {
    navigate(`/view-note/${noteId}`)
  }

  const handleSaveUnsave = async () => {
    try {
      if (!saved) {
        await axios.post(`https://ublog-ht6u.onrender.com/app/account/${noteId}/sa`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSaved(true);
      } else {
        await axios.delete(`https://ublog-ht6u.onrender.com/app/account/${noteId}/unsa`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setSaved(false);
      }
    } catch (error) {
      console.error('Error saving/unsaving blog', error.response);
    }
  }

  if (!note) return <div></div>;
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true });

  return (
    <div className={`note-view ${lightMode ? 'light-mode' : ''}`} >
      <div className="con" onClick={openNote}>
        <div className="note-header">
          <img
            src={profile && profile.userAccount
              ? profile.userAccount.profilePicture
              : authorPic}
            alt=''
            className="note-avatar"
          />
          <div className="note-author-details">
            <h3>{note.author.username}</h3>
            <span>{timeAgo.replace('about', '')}</span>
          </div>
        </div>
        <div className="note-content">
          <p>{note.text}</p>
        </div>
      </div>
      <div className="note-ftr">
        <div className="likeDiv">
          <span className='likeSpan' onClick={handleLike} >{liked ? <FontAwesomeIcon style={{ color: 'red' }} icon={faHeart} /> : <FontAwesomeIcon style={{ color: 'white' }} icon={faHeart} />}</span>
          <span className='countSpan'>{note.likeCount}</span>
        </div>
        <div className="deleteSave">
          {user && showSaveIcon && (
            <button style={{ color: saved ? 'white' : 'black' }} className="bookmark-btn" onClick={handleSaveUnsave}><FontAwesomeIcon icon={faBookmark} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteView;
