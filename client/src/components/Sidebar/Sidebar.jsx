import React, { useState, useEffect, useContext } from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import UserAccount from '../UserAccount/UserAccount';
import { useAuth } from '../../authContext';
import axios from 'axios';
// import { useAuth } from '../../authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faPencil, faPenToSquare, faUser, faBookmark } from "@fortawesome/free-solid-svg-icons";
import lightModeContext from '../../lightModeContext';

function Sidebar({nav, handleMenu}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  // const [lightMode, setLightMode] = useState(false);
  const [userProfile, setuserProfile] = useState(null);
  const { user } = useAuth();
  const { lightMode, togglelightMode} = useContext(lightModeContext);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // useEffect(() => {
  //   const savedMode = localStorage.getItem('lightMode') === 'true';
  //   console.log(savedMode)
  //     setLightMode(savedMode);
  //     document.body.classList.toggle('light-mode', savedMode);
    
  // }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await axios.get(`https://ublog-ht6u.onrender.com/app/account`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setuserProfile(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    fetchUserProfile();
  }, [user]);



  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveUserInfo = (userInfo) => {
    console.log('User Info');
    // Save user info to your backend or state
  };

  const addUser = (newUser) => {
    console.log('New User');
    setuserProfile(newUser);
    setIsUserModalOpen(false); // Close modal after adding user
  };
  const updateUser = (updatedUser) => {
    console.log('Updated User');
    setIsUserModalOpen(false); // Close modal after adding user
  };
  return (
    <div className='conS'>
      {nav == false ? (
       <div>
        {user && (<div className={`mainS ${lightMode ? 'light-mode' : ''}`}>
          <Link className='sidLinks' to={'/add-blog'}>
            <FontAwesomeIcon className='icons' icon={faPlus} />
            <p className='iconFont'>Add Blog</p>
          </Link>
          <Link className='sidLinks' to={'/view-blogs'}>
            <FontAwesomeIcon className='icons' icon={faMagnifyingGlass} />
            <p className='iconFont'>Browse Blogs</p>
          </Link>
          <div className='sidLinks'>
          <FontAwesomeIcon onClick={handleOpenModal} className='icons' icon={userProfile ? faPencil : faPenToSquare} />
          <p className='iconFont'>{userProfile ? 'Edit profile' : 'Add profile'}</p>
          </div>
          <UserAccount
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            onSave={handleSaveUserInfo}
            onAddUser={addUser}
            onUpdateUser={updateUser}
          />
          {userProfile && (
            <div>
              <Link onClick={handleMenu} className='sidLinks' to={'/view-account'}>
                <FontAwesomeIcon className='icons' icon={faUser} />
                <p className='iconFont'>View Account</p>
              </Link>
              <Link onClick={handleMenu} className='sidLinks' to={'/saved-posts'}>
                <FontAwesomeIcon className='icons' icon={faBookmark} />
                <p className='iconFont'>Saved</p>
              </Link>
            </div>
          )}
        </div>)}
       </div>
      ): (
        <div>
          {user &&(
            <div className='navS'>
            <Link onClick={handleMenu} className='sidLinks' to={'/add-blog'}>
              <FontAwesomeIcon className='icons' icon={faPlus} />
              <p className='iconFont'>Add Blog</p>
            </Link>
            <Link onClick={handleMenu} className='sidLinks' to={'/view-blogs'}>
              <FontAwesomeIcon className='icons' icon={faMagnifyingGlass} />
              <p className='iconFont'>Browse Blogs</p>
            </Link>
            <div  className='sidLinks'>
            <FontAwesomeIcon onClick={handleOpenModal} className='icons' icon={userProfile ? faPencil : faPenToSquare} />
            <p className='iconFont'>{userProfile ? 'Edit profile' : 'Add profile'}</p>
            </div>
            <UserAccount
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              onSave={handleSaveUserInfo}
              onAddUser={addUser}
              onUpdateUser={updateUser}
            />
            {userProfile && (
              <div className='profileLinks'>
                <Link onClick={handleMenu} className='sidLinks' to={'/view-account'}>
                  <FontAwesomeIcon className='icons' icon={faUser} />
                  <p className='iconFont'>View Account</p>
                </Link>
                <Link onClick={handleMenu} className='sidLinks' to={'/saved-posts'}>
                  <FontAwesomeIcon className='icons' icon={faBookmark} />
                  <p className='iconFont'>Saved</p>
                </Link>
              </div>
            )}
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
