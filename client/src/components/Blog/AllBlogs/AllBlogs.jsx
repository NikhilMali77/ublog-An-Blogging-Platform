import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPost from '../BlogPost/BlogPost';
import './allblogs.css';
import Loader from '../../Loader/Loader';
import placeholder from '../../../assets/placeholder.webp';
import { useAuth } from '../../../authContext';

function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const {user} = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/blogs?page=${page}&limit=10`);
        setPosts((prevPosts) => [...prevPosts, ...response.data.blogs]);
        setTotalPages(response.data.totalPages);
        setLoading(false);
        setLoadingMore(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMorePosts = () => {
    if (page < totalPages) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mainn">
      <div className='mainB'>
        {posts.map((blog) => (
          <BlogPost
            key={blog._id}
            postId={blog._id}
            blog={blog}
            title={blog.title}
            imageURL={blog.imageURL || placeholder}
            content={blog.content}
            author={blog.author.username}
            user={user}
          />
        ))}
      </div>
      <div className='load-more-container'>
        {page < totalPages && (
          <button className="load-more-btn" onClick={loadMorePosts} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>

    </div>
    // </div>
  );
}

export default AllBlogs;
