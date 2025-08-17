import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    geoLocation: null,
    currentLocation: null,
    searchedLocations: [],
    searchedLocation: null,
    error: null,
  },
  reducers: {
    setGeoLocation: (state, action) => {
      state.geoLocation = action.payload;
      state.error = null;
    },
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setGeoLocationError: (state, action) => {
      state.error = action.payload;
    },
    setSearchedLocation: (state, action) => {
      state.searchedLocation = action.payload;
    },
    addSearchedLocation: (state, action) => {
      state.searchedLocations?.push(action.payload);
    },
    removeSearchedLocation: (state, action) => {
      state.searchedLocations = state.searchedLocations.filter(
        (location) => location.locationName !== action.payload
      );
    },
  },
});

export const {
  setGeoLocation,
  setCurrentLocation,
  addSearchedLocation,
  removeSearchedLocation,
  setGeoLocationError,
  setSearchedLocation,
} = locationSlice.actions;
export default locationSlice.reducer;
