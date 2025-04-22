import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './userprofile.css';
import BlogPost from '../Blog/BlogPost/BlogPost';
import NoteView from '../Note/NoteView/NoteView';
import { useDispatch } from 'react-redux';
import lightModeContext from '../../lightModeContext';
import Loader from '../Loader/Loader';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const {lightMode} = useContext(lightModeContext);
  const dispatch = useDispatch()

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://ublog-ht6u.onrender.com/app/account', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

 


  if (!userProfile) return <Loader />;

  return (
    <div className="mainU">
      <div className={`user-profile ${lightMode ? 'light-mode' : ''}`}>
        <div className="profile-header">
          <img src={userProfile.profilePic} alt={userProfile.user.username} className="profile-avatar" />
          <div className="profile-details">
            <h2 className='usernameP'>{userProfile.user.username}</h2>
            <p className='usernameP'>{userProfile.description}</p>
            <div className="profile-stats">
              <span className='spanns'>Blogs: {userProfile.numberOfBlogs}</span>
              <span className='spanns'>Notes: {userProfile.numberOfNotes}</span>
            </div>
          </div>
        </div>
        <div className='line'></div>
        <div className="profile-content">
          <h3 className='blogP'>Blogs</h3>
          <div className="blog">
            {userProfile.blogs.length > 0 ? (
              userProfile.blogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  postId={blog._id}
                  title={blog.title}
                  imageURL={blog.imageURL}
                  content={blog.content}
                  author={blog.author.username}
                  authorId={blog.author._id}
                />
              ))
            ) : (
              <div className='noBlogs'>
                <h1>No blogs available.</h1>
                <h2>Your blogs will be visible here</h2>
              </div>
            )}
          </div>
          <div className='line'></div>
          <h3 className='noteP'>Notes</h3>
          <div className="note">
            {userProfile.notes.length > 0 ? (
              userProfile.notes.map((note) => (
                <NoteView key={note._id} noteId={note._id} onDelete={() => onDelete(note._id)} />
              ))
            ) : (
              <div className='noNotes'>
                <h1>No notes available.</h1>
                <h2>Your notes will be visible here</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
