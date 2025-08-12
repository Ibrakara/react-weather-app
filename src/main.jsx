import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./store";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>
);
