import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import './savedposts.css'; // Your CSS file for styling
import { useAuth } from '../../authContext';
import BlogPost from '../Blog/BlogPost/BlogPost';
import NoteView from '../Note/NoteView/NoteView';
import lightModeContext from '../../lightModeContext';
import Loader from '../Loader/Loader';
import placeholder from '../../assets/placeholder.webp';

function SavedPosts() {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedOption, setSelectedOption] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lightMode } = useContext(lightModeContext);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('https://ublog-ht6u.onrender.com/app/account', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchBlogsAndNotes = async () => {
      try {
        const [blogsResponse, notesResponse] = await Promise.all([
          axios.get('https://ublog-ht6u.onrender.com/app/blogs', {
            params: {
              page: 1, // You can still keep pagination, but no limit on blogs
              limit: Number.MAX_SAFE_INTEGERŌ, // Set to maximum to retrieve all blog
            },
          }),
          axios.get('https://ublog-ht6u.onrender.com/app/notes'),
        ]);
        setBlogs(blogsResponse.data.blogs); // Extract the blogs array from the response
        setNotes(notesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs and notes:', error);
        setLoading(false);
      }
    };

    fetchBlogsAndNotes();
  }, []);

  useEffect(() => {
    if (userProfile && blogs.length > 0 && notes.length > 0) {
      const filteredBlogs = blogs.filter((blog) =>
        userProfile.savedBlogs.includes(blog._id)
      );
      const filteredNotes = notes.filter((note) =>
        userProfile.savedNotes.includes(note._id)
      );
      setUserBlogs(filteredBlogs);
      setUserNotes(filteredNotes);
    }
  }, [userProfile, blogs, notes]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`saved-posts ${lightMode ? 'light-mode' : ''}`}>
      <div className="options">
    {console.log(userBlogs)}
        <div
          className={`option ${selectedOption === 'blogs' ? 'active' : ''}`}
          onClick={() => handleOptionChange('blogs')}
        >
          Blogs ({userProfile && userProfile.savedBlogs.length})
        </div>
        <div
          className={`option ${selectedOption === 'notes' ? 'active' : ''}`}
          onClick={() => handleOptionChange('notes')}
        >
          Notes ({userProfile && userProfile.savedNotes.length})
        </div>
      </div>
      <div className="content">
        {selectedOption === 'blogs' && (
          <div className="blogs-section">
            {userBlogs.length > 0 ? (
              userBlogs.map((blog) => (
                <div key={blog._id} className="blog-item">
                  <BlogPost
                    key={blog._id}
                    postId={blog._id}
                    title={blog.title}
                    imageURL={blog.imageURL || placeholder}
                    content={blog.content}
                    author={blog.author.username}
                    authorId={blog.author._id}
                    blog={blog}
                    user={user ? user : ''}
                  />
                </div>
              ))
            ) : (
              <div className="no-saved-blogs">
                <img src={placeholder} alt="No Blogs" className="placeholder-image"/>
                <p>No saved blogs yet!</p>
              </div>
            )}
          </div>
        )}
        {selectedOption === 'notes' && (
          <div className="notes-section">
            {userNotes.length > 0 ? (
              userNotes.map((note) => (
                <div key={note._id} className="note-item">
                  <NoteView key={note._id} noteId={note._id} showSaveIcon={false} />
                </div>
              ))
            ) : (
              <div className="no-saved-notes">
                <img src={placeholder} alt="No Notes" className="placeholder-image"/>
                <p>No saved notes yet!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedPosts;
