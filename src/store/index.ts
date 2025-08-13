import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/user/userSlice'; // Assuming you will create a userSlice for user-related state

const store = configureStore({
  reducer: {
    user: userSlice,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;