import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isThemeLight: true,
  },
  reducers: {
    toggleTheme: (state) => {
      state.isThemeLight = !state.isThemeLight;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
