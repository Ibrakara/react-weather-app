import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./store";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </QueryClientProvider>
  </StrictMode>
);
