import React, { useContext, useEffect, useState } from 'react'
import './blog-section.css'
import BlogPost from '../BlogPost/BlogPost';
import axios from 'axios';
import { useAuth } from '../../../authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import lightModeContext from '../../../lightModeContext';
import placeholder from '../../../assets/placeholder.webp'
function BlogSection() {
  const [posts, setPosts] = useState({ blogs: [], currentPage: 1, totalPages: 1 });
  const [postPerPage, setPostPerPage] = useState(3);
  const {currentPage, blogs} = posts;
  const {user} = useAuth()
  const {lightMode} = useContext(lightModeContext)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://ublog-ht6u.onrender.com/app/blogs',{
          params: { page: currentPage, limit: postPerPage },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
        setPosts(response.data)
      
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchPosts()
  },[currentPage, postPerPage])
  // const lastPostIndex = currentPage * postPerPage;
  // const firstPostIndex = lastPostIndex - postPerPage;
  // const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  const handleNextPage = () => {
    if(currentPage < posts.totalPages){
      setPosts(prevState => ({...prevState, currentPage: prevState.currentPage + 1}))
    }
  }
  const handlePrevPage = () => {
    if(currentPage > 1){
      setPosts(prevState => ({...prevState, currentPage: prevState.currentPage - 1}))
    }
  }
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth <= 947) {
        setPostPerPage(1)
      }
      else if(window.innerWidth <= 1449) {
        setPostPerPage(2)
      }
      else {
        setPostPerPage(3)
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct number of posts

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  return (
    <div className={`blog-section ${lightMode ? 'light-mode' : ''}`}>
      <h1>See what's happening</h1>
      <div className="innerBS">
      
      <div className="inner">
      <div onClick={handlePrevPage} ><button className="pagingBtns" disabled={currentPage === 1}><FontAwesomeIcon icon={faChevronLeft}/></button></div>
        {blogs.map(blog => (
          <BlogPost
          key={blog._id}
          postId={blog._id}
          title={blog.title}
          imageURL={blog.imageURL || placeholder}
          content={blog.content}
          author={blog.author.username}
          authorId={blog.author._id}
          blog={blog}
          user={user? user : ''}
          />
        ))}
         <div onClick={handleNextPage}><button className="pagingBtns" disabled={currentPage === Math.ceil(posts.length/posts.totalPages)}><FontAwesomeIcon icon={faChevronRight}/></button></div>
      </div>
     
      </div>
      
    </div>
  )
}

export default BlogSection