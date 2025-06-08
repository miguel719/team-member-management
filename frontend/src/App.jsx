// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ListPage from "./pages/ListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("access") ? (
                <Navigate to="/list" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <ListPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
