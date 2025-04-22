import { configureStore } from "@reduxjs/toolkit";
import noteReducer from './noteSlice.js'

export const store = configureStore({
  reducer: {
    notes: noteReducer
  }
});

export default store;