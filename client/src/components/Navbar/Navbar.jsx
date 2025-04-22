import React, { useState, useEffect, useContext } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import lightModeContext from '../../lightModeContext';
import { toast } from 'sonner';
import ublog from '../../assets/Ublog.webp'

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], blogs: [] });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lightMode, togglelightMode } = useContext(lightModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenT = localStorage.getItem('token');
    if (tokenT) {
      setIsAuthenticated(true);
    }
    const handleResize = () => {
      setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://ublog-ht6u.onrender.com/app/search?query=${query}`);
      setResults(response.data);
      setSearchPerformed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchPerformed(false);
    setResults({ users: [], blogs: [] });
  };

  const handleLogout = () => {
    axios.defaults.headers.common['Authorization'] = '';
    setIsAuthenticated(false);
    logout();
    toast.success('User Logged out successfuly!', {
      style: {
        backgroundColor: '#4caf50',
        color: '#fff',
        borderRadius: '8px',
        border: 'none'
      },
    });
    navigate('/');
  };

  const handleMenu = () => {
    setMenuOpen(false);
  };

  const combinedHandler = () => {
    handleMenu();
    handleLogout();
  };
  
  const openUser = (userId) => {
    navigate(`/user/${userId}`)
    handleClear()
  }

  const openBlog = (blogId) => {
    navigate(`/blog/${blogId}`)
    handleClear()
  }

  return (
    <div className={`mainNav ${lightMode ? 'light-mode' : ''}`}>
      <div onClick={() => navigate('/')} className="lhs">
        <img src={ublog} alt="" />
        <h3>UBlog</h3>
      </div>
      <div className="mid">
        <div className="searchBox">
          <input
            type="text"
            placeholder='Search here'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && <button className='cancelBtn' type="button" onClick={handleClear}>×</button>}
          <button className='srchBtn' onClick={handleSearch}>Search</button>
          <div className="results-box">
            {results.users.length > 0 || results.blogs.length > 0 ? (
              <>
                {results.users.length > 0 && (
                  <div className="results-section">
                    <h4>Users</h4>
                    {results.users.map(user => (
                      <div key={user._id} className="search-result-item" onClick={() => openUser(user._id)}>
                        <img src={user.userAccount?.profilePicture || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt={user.username} />
                        <div className="search-result">
                          <p className='innerText'>{user.username}</p>
                          <p>{user.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {results.blogs.length > 0 && (
                  <div className="results-section">
                    <h4>Blogs</h4>
                    {results.blogs.map(blog => (
                      <div key={blog._id} className="search-result-item">
                        <img src={blog.author.userAccount?.profilePicture || 'https://via.placeholder.com/50'} alt={blog.author.username} />
                        <div className="search-result"onClick={() => openBlog(blog._id)}>
                          <p className='innerText'>{blog.title}</p>
                          <p className='innerUsername'>{blog.author.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              searchPerformed && <p className='noResult'>No results found</p>
            )}
          </div>
        </div>
      </div>
      <div className="rhs">
        <button className='navBtns'><Link className='btnLinks' to='/'>Home</Link></button>
        {isAuthenticated ? (
          <button className='navBtns' onClick={handleLogout}><Link className='btnLinks'>Logout</Link></button>
        ) : (
          <>
            <button className='navBtns'><Link className='btnLinks' to='/register'>Sign Up</Link></button>
            <button className='navBtns'><Link className='btnLinks' to='/login'>Sign In</Link></button>
          </>
        )}
        <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </div>
        <div className="toggle-container">
          <input
            type="checkbox"
            id="toggle"
            className="toggle-checkbox"
            checked={lightMode}
            onChange={togglelightMode}
          />
          <label htmlFor="toggle" className="toggle-label"></label>
        </div>
        {menuOpen && (
          <div className='sign-up'>
            <FontAwesomeIcon onClick={handleMenu} className='closeIcon' icon={faClose} />
            <div className="srchbox">
              <div className="resultsField">
                <div className={`results-box ${searchPerformed && (results.users.length > 0 || results.blogs.length > 0) ? 'open' : ''}`}>
                  {results.users.length > 0 || results.blogs.length > 0 ? (
                    <>
                      {results.users.length > 0 && (
                        <div className="results-section">
                          <h4>Users</h4>
                          {results.users.map(user => (
                            <div key={user._id} className="search-result-item">
                              <img src={user.userAccount?.profilePicture || 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='} alt={user.username} />
                              <div className="search-result">
                                <p className='innerText'>{user.username}</p>
                                <p>{user.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {results.blogs.length > 0 && (
                        <div className="results-section">
                          <h4>Blogs</h4>
                          {results.blogs.map(blog => (
                            <div key={blog._id} className="search-result-item">
                              <img src={blog.author.userAccount?.profilePicture || 'https://via.placeholder.com/50'} alt={blog.author.username} />
                              <div className="search-result">
                                <p className='innerText'>{blog.title}</p>
                                <p className='innerUsername'>{blog.author.username}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    searchPerformed && <p className='noResult'>No results found</p>
                  )}
                </div>
              </div>
              <div className="srchfield">
                <input
                  type="text"
                  placeholder='Search here'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && <button className='cancelBtn' type="button" onClick={handleClear}>×</button>}
                <button className='searchBtn' onClick={handleSearch}>Search</button>
              </div>
            </div>
            <div className='sidebar'><Sidebar nav={true} handleMenu={handleMenu} /></div>
            <Link className='btnLinks' to='/'><button onClick={() => setMenuOpen(false)} className='navBtns'>Home</button></Link>
            {isAuthenticated ? (
              <Link className='btnLinks'><button className='navBtns' onClick={combinedHandler}>Logout</button></Link>
            ) : (
              <>
                <Link className='btnLinks' to='/register'><button onClick={() => setMenuOpen(false)} className='navBtns'>Sign Up</button></Link>
                <Link className='btnLinks' to='/login'><button onClick={() => setMenuOpen(false)} className='navBtns'>Sign In</button></Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
