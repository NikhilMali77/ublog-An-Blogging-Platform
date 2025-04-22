import React, { useEffect } from 'react';
import './comment.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../authContext';
function Comment({ comment }) {
  const {blogId} = useParams()
  const {user} = useAuth()
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}/comments/${comment._id}`)
      console.log('comment deleted')
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
  return (
    <div className="comment">
      <p><strong>{comment.username}</strong></p>
      <p>{comment.text}</p>
      {user.username == comment.username ? <button className='deleteB' onClick={handleDelete}>Delete</button> : ''}
      
    </div>
  );
}

export default Comment;
