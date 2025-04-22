import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  notes: [],
  status: 'idle',
  error: null
};

export const addNote = createAsyncThunk('/notes/addNote', async(newNote) => {
  const response = await axios.post('https://ublog-ht6u.onrender.com/app/notes', newNote);
  return response.data;
})

export const getNotes = createAsyncThunk('/notes/getNotes', async() => {
  const response = await axios.get('https://ublog-ht6u.onrender.com/app/notes')
  return response.data;
})
export const getNoteById = createAsyncThunk('/notes/getNoteById', async(noteId) => {
  const response = await axios.get(`https://ublog-ht6u.onrender.com/app/notes/${noteId}`)
  return response.data;
})
export const deleteNote = createAsyncThunk('/notes/deleteBlog', async(noteId) => {
  await axios.delete(`https://ublog-ht6u.onrender.com/app/notes/${noteId}`)
  return noteId;
})

const noteSlice =  createSlice({
  name: 'notes',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(addNote.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(addNote.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.notes.push(action.payload);
    })
    .addCase(addNote.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.error.message;
    })
    .addCase(getNotes.pending, (state) => {
      state.loading = true;
    })
    .addCase(getNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.loading = false;
    })
    .addCase(getNotes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
    .addCase(deleteNote.fulfilled, (state, action) => {
      state.notes = state.notes.filter(note => note._id !== action.payload);
    })
  }
})

export default noteSlice.reducer;