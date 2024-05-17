import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Make sure you have a rootReducer

const store = configureStore({
  reducer: rootReducer,
});

export default store;
