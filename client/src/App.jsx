import React, { useContext, useEffect, useState } from 'react';
import BlogSection from './components/Blog/BlogSection/BlogSection';
import NoteSection from './components/Note/NoteSection/NoteSection';
import Navbar from './components/Navbar/Navbar';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import SignUp from './components/SignUp/SignUp';
import { AuthProvider } from './authContext';
import { checkAuth } from './utils/checkAuth';
import AddBlog from './components/AddBlog/AddBlog';
import AllBlogs from './components/Blog/AllBlogs/AllBlogs';
import ViewBlog from './components/Blog/ViewBlog/ViewBlog';
import UserProfile from './components/UserProfile/UserProfile';
import NotePage from './components/Note/NotePage/NotePage';
import SavedPosts from './components/SavedPosts/SavedPosts';
import Sidebar from './components/Sidebar/Sidebar';
import lightModeContext from './lightModeContext';
import EditBlog from './components/Blog/EditBlog/EditBlog';
import {Toaster} from 'sonner'
import UserDetails from './components/Blog/UserDetails/UserDetails';

function App() {
  const [user, setUser] = useState(null);
  const { lightMode } = useContext(lightModeContext);
  useEffect(() => {
    const authUser = checkAuth();
    setUser(authUser)
  }, [])

  return (
    <AuthProvider user={user} >
      <Toaster/>
      <Router>
        <div className="App">
          <Navbar />
          <div className={`home ${lightMode ? 'light-mode' : ''}`}>
            <div className={`lef ${user ? '' : 'expanded'}`}>
              <Sidebar nav={false} />
            </div>
            <div className={`right ${user ? '' : 'expanded'}`}>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path="/login" element={<SignIn />} />
                <Route path='/register' element={<SignUp />} />
                <Route path='/add-blog' element={<AddBlog />} />
                <Route path='/view-blogs' element={<AllBlogs />} />
                <Route path='blog/:blogId' element={<ViewBlog />} />
                <Route path='view-account' element={<UserProfile />} />
                <Route path='view-note/:noteId' element={<NotePage />} />
                <Route path='saved-posts' element={<SavedPosts />} />
                <Route path=':blogId/edit' element={<EditBlog/>}/>
                <Route path='user/:userId' element={<UserDetails/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
