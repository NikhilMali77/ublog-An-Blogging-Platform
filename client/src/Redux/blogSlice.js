import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  blogs: [],
  status: 'idle',
  error: null
};

export const addblog = createAsyncThunk('/blogs/addblog', async(newblog) => {
  const response = await axios.post('https://ublog-ht6u.onrender.com/app/blogs', newblog);
  return response.data;
})

export const getblogs = createAsyncThunk('/blogs/getblogs', async() => {
  const response = await axios.get('https://ublog-ht6u.onrender.com/app/blogs')
  return response.data;
})
export const deleteBlog = createAsyncThunk('/blogs/deleteBlog', async(blogId) => {
  await axios.delete(`https://ublog-ht6u.onrender.com/app/blogs/${blogId}`)
  return blogId;
})

const blogslice =  createSlice({
  name: 'blogs',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(addblog.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addblog.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.blogs.push(action.payload);
    })
    .addCase(addblog.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message;
    })
    .addCase(getblogs.pending, (state) => {
      state.loading = true;
    })
    .addCase(getblogs.fulfilled, (state, action) => {
      state.blogs = action.payload;
      state.loading = false;
    })
    .addCase(getblogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
    .addCase(deleteBlog.fulfilled, (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
    })
  }
})

export default blogslice.reducer;