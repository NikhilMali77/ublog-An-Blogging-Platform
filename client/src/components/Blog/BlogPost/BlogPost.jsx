import React, { useEffect, useState } from "react";
import { htmlToText } from 'html-to-text';
import './blog-post.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

function BlogPost({ user, blog, postId, title, imageURL, content, author }) {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState()

  let plainTextSummary = htmlToText(content, {
    limits: { maxInputLength: 100000 }, // Adjust this limit as needed
    preserveNewlines: false,
  });
  plainTextSummary = plainTextSummary.replace(/--+/g, ' ');
  const truncatedText = (text, num) => {
    return text.split(" ").slice(0, num).join(" ") + '...';
  }
  let truncatedTitle = truncatedText(title, 4)
  let truncatedContent = truncatedText(plainTextSummary, 4);

  const openBlog = () => {
    navigate(`/blog/${postId}`)
  }

  useEffect(() => {
    if (user && (user.userId || user._id)) {
      setSaved(blog.saves.includes((user._id ||user.userId )))
    }
  }, [])

  const handleSaveUnsave = async () => {
    try {
      if (!saved) {
        const response = await axios.post(`https://ublog-ht6u.onrender.com/app/account/${postId}/save`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSaved(true);
      } else {
        const response = await axios.delete(`https://ublog-ht6u.onrender.com/app/account/${postId}/unsave`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setSaved(false);
      }
    } catch (error) {
      console.error('Error saving/unsaving blog', error);
    }
  }
  return (
    <div className="blog-preview" >
      <div className="action" onClick={openBlog}>
        {imageURL && (
          <div className="imgDiv">
            <img src={imageURL} alt={title} className="blog-image" />
          </div>
        )}
        <div className="blog-details">
          <h2>{truncatedTitle}</h2>
          <p>{truncatedContent}</p>
          <p>{author}</p>
        </div>
      </div>
      <div className="blog-actions">
        {user && (user._id || user.userId )  && (
          <button style={{ color: saved ? '#248d92' : 'white' }} className="bookmark-btn" onClick={handleSaveUnsave}><FontAwesomeIcon icon={faBookmark} /></button>
        )}
        {/* <button className="more-btn">⋮</button> */}
      </div>
    </div>
  );
}

export default BlogPost;
