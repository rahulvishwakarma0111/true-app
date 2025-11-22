import { configureStore } from '@reduxjs/toolkit';
import homepageReducer from './homepage/homepageSlice';

const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
});

export default store;