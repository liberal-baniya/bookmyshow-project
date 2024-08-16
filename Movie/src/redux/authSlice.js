import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
  },
  reducers: {
    setAuthenticated(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { setAuthenticated, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
