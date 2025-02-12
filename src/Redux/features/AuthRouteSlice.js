import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem("token") || null,
};

export const authrouteSlice = createSlice({ 
  name: 'authroute',
  initialState,
  reducers: {

    login: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
  },
  logout: (state) => {
      state.token = null;
      localStorage.removeItem("token"); 
  }


  },
});

// Action creators are generated for each case reducer function
export const {login , logout} = authrouteSlice.actions; // Use the correct slice name

export default authrouteSlice.reducer; // Use the correct slice name
