import { createSlice, current } from "@reduxjs/toolkit";

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    currentWeather: null,
    forecastList: [],
  },
  reducers: {
    setCurrentWeather: (state, action) => {
      state.currentWeather = action.payload;
    },
    setForecastList: (state, action) => {
      state.forecastList = action.payload;
    },
  },
});

export const { setCurrentWeather, setForecastList } = weatherSlice.actions;
export default weatherSlice.reducer;
