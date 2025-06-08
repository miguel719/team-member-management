
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext";
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);

