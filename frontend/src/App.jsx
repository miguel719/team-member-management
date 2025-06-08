// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ListPage from "./pages/ListPage";
import MemberFormPage from "./pages/MemberFormPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          <Route path="/" element={
            localStorage.getItem("access")
              ? <Navigate to="/list" replace />
              : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route path="/list" element={
            <ProtectedRoute>
              <ListPage />
            </ProtectedRoute>
          } />
          <Route path="/members/add" element={
            <ProtectedRoute>
              <MemberFormPage />
            </ProtectedRoute>
          } />
          <Route path="/members/edit/:id" element={
            <ProtectedRoute>
              <MemberFormPage isEdit />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
