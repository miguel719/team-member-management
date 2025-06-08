// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ListPage from "./pages/ListPage";


function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
