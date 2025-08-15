import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    currentLocation: null,
    searchedLocation: "",
    error: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setLocationError: (state, action) => {
      state.error = action.payload;
    },
    setSearchedLocation: (state, action) => {
      state.searchedLocation = action.payload;
    },
  },
});

export const { setLocation, setSearchedLocation, setLocationError } =
  locationSlice.actions;
export default locationSlice.reducer;
