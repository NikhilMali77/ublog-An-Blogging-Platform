import React, { useContext, useEffect, useState } from 'react'
import './note-section.css'
import NoteView from '../NoteView/NoteView';
import NoteForm from '../NoteForm/NoteForm';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getNotes } from '../../../Redux/noteSlice';
import { useAuth } from '../../../authContext';
import lightModeContext from '../../../lightModeContext';
import Loader from '../../Loader/Loader';

function NoteSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notes = useSelector((state) => state.notes.notes);
  const loading = useSelector((state) => state.notes.loading);
  const error = useSelector((state) => state.notes.error);
  const { lightMode } = useContext(lightModeContext)
  const dispatch = useDispatch();
  const user = useAuth();

  useEffect(() => {
    dispatch(getNotes())
  }, [dispatch, user])

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Loader />

  if (error) return <p>Error: {error}</p>


  return (
    <div className={`main ${lightMode ? 'light-mode' : ''}`}>
      <div className="add-note">
        <input
          type="text"
          onClick={openModal}
          placeholder="Click to post a note..."
        />
        <NoteForm
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        />
      </div>
      <div className="view-notes">
        {notes.length > 0 ? (
          notes.map(note => (
            <NoteView key={note._id} noteId={note._id} showSaveIcon={true} />
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </div>
  )
}

export default NoteSection