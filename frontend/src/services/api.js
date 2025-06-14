// src/services/api.js

import { API_URL } from "../config";

// Login
export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/members/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { access, refresh }
}

// Signup
export async function signupUser(email, password) {
  const res = await fetch(`${API_URL}/members/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Signup failed");
  }

  return res.json();
}

// Authentication
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (_) {
      errorData = { error: "Request failed" };
    }
    throw { type: "ApiError", data: errorData };
  }

  return res.json();
}


// Check if token is valid
export async function isTokenValid() {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const res = await fetch("http://localhost:8000/members/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    return false;
  }
}


// Members API
export async function getMembers() {
  return authFetch("/members/");
}

export async function deleteMember(userId) {
  return authFetch(`/members/${userId}/`, { method: "DELETE" });
}

export async function updateMember(userId, data) {
  return authFetch(`/members/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function createMember(data) {
  return authFetch("/members/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// Get current user
export async function getCurrentUser() {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/members/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Not authorized");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function getMember(userId) {
  return authFetch(`/members/${userId}/`);
}


// Logout
export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login"; 
}