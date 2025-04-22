import React, { useContext, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './editblog.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../authContext';
import lightModeContext from '../../../lightModeContext';
import { toast } from 'sonner';
import Loader from '../../Loader/Loader';

function EditBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { user } = useAuth();
  const [selectedFileName, setSelectedFileName] = useState('')
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null)
  const { lightMode } = useContext(lightModeContext);
  const { blogId } = useParams();
  const handleEditorChange = (content, editor) => {
    setContent(content);
  };
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}`);
        setTitle(response.data.title)
        setImageURL(response.data.imageURL)
        setContent(response.data.content)
      } catch (error) {
        console.error('Error', error)
      }
    }
    fetchBlog()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file);
      setSelectedFileName(file.name); // Set the selected file name
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Content is required');
      return;
    }
    try {
      let uploadedImageUrl = imageURL
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

      const response = await axios.put(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}/edit`, {
        title,
        content,
        imageURL: uploadedImageUrl
      });
      console.log('Blog Edited');
      toast.success('Blog edited!', {
        style: {
          backgroundColor: '#4caf50',
          color: '#fff',
          borderRadius: '8px',
          border: 'none'
        },
      });
      // Clear form fields
      setTitle('');
      setImageFile(null)
      setImageURL('');
      setContent('');
      navigate(-1);
    } catch (error) {
      console.error('Error adding blog:', error);
      toast.error('Error editing blog!', {
        style: {
          backgroundColor: '#ff5722',
          color: '#fff',
          borderRadius: '8px',
          border: 'none'
        },
      });
    }
  };
  const handleBack = () => {
    navigate(-1)
  }
  if (!user) {
    return <Loader />; // or handle null user state
  }
  return (
    <div className={`mainA ${lightMode ? 'light-mode' : ''}`}>
      <h1 className='heading'>Edit Blog</h1>
      <form className='blogForm' onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            placeholder='Edit Blog Title here...'
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file"
            accept='image/*'
            onChange={handleFileChange}
          />
          {selectedFileName ? 
          (<p>Selected File: {selectedFileName}</p>) 
          :
          imageURL && (<p>Current File:<a href={imageURL}>View</a> </p>)
        }
          <label>Content:</label>
          <Editor
            apiKey="vm26iscrddva8boaks1s5t629zu1t29kl82qs5yztguenl7t"
            value={content}
            onEditorChange={handleEditorChange}
            className='tiny'
            init={{
              height: 300,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'

            }}
          />
        </div>
        <div className="btnGrp">
          <button className='back' type='button' onClick={handleBack}>Back</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default EditBlog