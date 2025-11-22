import { configureStore } from '@reduxjs/toolkit';
import homepageReducer from './homepage/homepageSlice';

const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,   // turn off globally
    }),
});

export default store;