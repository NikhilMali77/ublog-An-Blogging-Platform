import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import './useraccount.css';
import axios from 'axios';
import lightModeContext from '../../lightModeContext';

Modal.setAppElement('#root');

const UserAccount = ({ onAddUser, onUpdateUser, isOpen, onRequestClose }) => {
  const [profilePic, setProfilePic] = useState('');
  const [description, setDescription] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { lightMode } = useContext(lightModeContext);
  const [imageFile, setImageFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState('')

    useEffect(() => {
      const fetchUserAccount = async () => {
        try {
          const response = await axios.get('https://ublog-ht6u.onrender.com/app/account');
          if (response.data) {
            setProfilePic(response.data.profilePic);
            setDescription(response.data.description);
            setIsUpdateMode(true)
          }
        } catch (error) {
          console.error('Error', error)
        }
      }
      fetchUserAccount();
    }, [isOpen])
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file.name)
      setImageFile(file)
    }
  }
  const handleSave = async () => {
    let uploadedImageUrl = profilePic
    try {
      if(imageFile){
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('upload_preset', 'ml_default')

        //Passing the file to cloudinary
        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dmx577ow7/image/upload', {
          method: 'POST',
          body: formData
        })
        if(!uploadResponse.ok){
          const errorData = await uploadResponse.json()
          console.error('Upload error details:', errorData);
          throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
        }
        const uploadedData = await uploadResponse.json()
        uploadedImageUrl = uploadedData.secure_url
      }
      const userInfo = {
        profilePicture: uploadedImageUrl,
        description,
      };

      if (isUpdateMode) {
        const response = await axios.put('https://ublog-ht6u.onrender.com/app/account', userInfo);
        onUpdateUser(response.data);
      } else {
        const response = await axios.post('https://ublog-ht6u.onrender.com/app/account', userInfo);
        onAddUser(response.data);
      }
    } catch (error) {
      console.error('Error saving user account:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }

    onRequestClose();
    setProfilePic('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Account Modal"
      className={`modal ${lightMode ? 'light-mode' : ''}`}
      overlayClassName="overlay"
    >
      <h2>Edit User Account</h2>
      <form>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture URL:</label>
          <input
            type="file"
            id="profilePic"
            accept='image/*'
            onChange={handleFileChange}
          />
          {selectedFile ? 
        <p>Selected image: {selectedFile}</p>:
        profilePic &&
        (<p>Current image: <a style={{"text-decoration": 'none', color: 'white'}} href={profilePic}>View</a></p>)  
        }
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="btnClass">
          <button className='modBtn' type="button" onClick={handleSave}>{isUpdateMode ? 'Update' : 'Save'}</button>
          <button className='modBtn' type="button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default UserAccount;