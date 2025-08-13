import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  loggedIn: boolean;
}

const initialState: UserState = {
  name: '',
  loggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
      state.loggedIn = true;
    },
    logout(state) {
      state.name = '';
      state.loggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;