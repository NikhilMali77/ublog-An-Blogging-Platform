import React, { useContext, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './addblog.css';
import { useAuth } from '../../authContext';
import { useNavigate } from 'react-router-dom';
import lightModeContext from '../../lightModeContext';
import { toast } from "sonner";
import Loader from '../Loader/Loader';

function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lightMode } = useContext(lightModeContext);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        let uploadedImageURL = '';

        // Upload image to Cloudinary
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'ml_default');

            const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dmx577ow7/image/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                console.error('Upload error details:', errorData);
                throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
            }

            const uploadData = await uploadResponse.json();
            uploadedImageURL = uploadData.secure_url;
            console.log('Upload successful:');
        }

        // Save blog post to MongoDB
        const blogData = {
            author: user._id,
            title,
            content,
            imageURL: uploadedImageURL,
        };

        const response = await axios.post('https://ublog-ht6u.onrender.com/app/blogs', blogData);

        if (response.status === 201) {
            toast.success('Blog created!', {
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                },
            });

            // Clear form fields
            setTitle('');
            setContent('');
            setImageFile(null);
            setImageURL('');
            navigate(-1);
        } else {
            throw new Error('Failed to save blog post.');
        }

    } catch (error) {
        console.error('Error adding blog:', error);
        toast.error('Error adding blog!', {
            style: {
                backgroundColor: '#ff5722',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
            },
        });
    } finally {
        setIsSubmitting(false);
    }
};



  const handleBack = () => {
    navigate(-1);
  };

  if (!user) {
    return <div><Loader /></div>;
  }

  return (
    <div className={`mainA ${lightMode ? 'light-mode' : ''}`}>
      <h1 className='heading'>Add Blog</h1>
      <form className='blogForm' onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            placeholder='Add Blog Title here...'
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
          <label>Content:</label>
          <Editor
            apiKey="n8wq09hyn1ktnqlje6e0d078yp27307pe4f2f1aloau3b7g6"
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
          <button className='back' onClick={handleBack} disabled={isSubmitting}>Back</button>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}

export default AddBlog;
