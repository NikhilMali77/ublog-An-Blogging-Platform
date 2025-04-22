import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import './view-blog.css';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../authContext';
import { deleteBlog } from '../../../Redux/blogSlice';
import lightModeContext from '../../../lightModeContext';
import { toast } from "sonner";
import Loader from '../../Loader/Loader';
import Comment from '../Comment/Comment';

function ViewBlog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]); // State to hold comments
  const { user } = useAuth();
  const [ text, setText] = useState('')
  const { lightMode } = useContext(lightModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const backFunction = () => {
    navigate(-1);
  };

  const openUpdateBlog = () => {
    navigate(`/${blogId}/edit`);
  }

  const deleteFunction = async (blogId) => {
    try {
      await dispatch(deleteBlog(blogId)).unwrap();
      console.log('Blog deleted');
      toast.success('Blog deleted!', {
        style: {
          backgroundColor: 'teal',
          color: '#fff',
          borderRadius: '8px',
          border: 'none'
        },
      });
      navigate(-1);
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}/`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
    fetchComments(); // Fetch comments when the component mounts
  }, [blogId, dispatch, comments]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}/comments`, {text: text});
      setComments([...comments, response.data]); // Append new comment to the list
      setText('')
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  if (!blog) {
    return <Loader />; // Add a loading state
  }

  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <div className="upper">
      <div className={`mainV ${lightMode ? 'light-mode' : ''}`}>
        <h1>{blog.title}</h1>
        <div className="imgClass">
          <img className="blogImg" src={blog.imageURL} alt={blog.title} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        <p className='timeClass'><span>Posted {timeAgo}</span></p>
        <p>Posted by {blog.author.username}</p>
        <div className="blogBtns">
          <button onClick={backFunction} className="backBtn">Back</button>
          {user && user.userId === blog.author._id ? (
            <div>
              <button onClick={() => deleteFunction(blog._id)} className='deleteBtn'>Delete</button>
              <button onClick={() => openUpdateBlog()} className='editBtn'>Edit</button>
            </div>
          ) : ''}
        </div>

        {/* Comments Section */}
        
        <div className="commentsSection">
          <h2>Comments</h2>
          {/* Comment Form */}
        {user && (
          <div className="addComment">
            <textarea placeholder="Add a comment..." value={text}
                    onChange={(e) => setText(e.target.value)} />
            <button onClick={handleAddComment}>Post Comment</button>
          </div>
        )}
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))
          )}
        </div>

        
      </div>
    </div>
  );
}

export default ViewBlog;
