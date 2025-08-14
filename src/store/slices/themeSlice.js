import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", // Default mode
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; // Toggle between light and dark mode
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
