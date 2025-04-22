import React, { useContext } from 'react'
import BlogSection from '../Blog/BlogSection/BlogSection'
import NoteSection from '../Note/NoteSection/NoteSection'
import './home.css';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '../../authContext';
import lightModeContext from '../../lightModeContext';

function HomePage() {
  const { lightMode, togglelightMode } = useContext(lightModeContext);
  const { user } = useAuth();

  return (
    <div className={'right'}>
      <BlogSection />
      <NoteSection />
    </div>
  )
}

export default HomePage;
