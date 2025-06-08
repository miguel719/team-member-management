let API_URL = "http://localhost:8000";

if (typeof process !== "undefined" && process.env && process.env.VITE_API_URL) {
  API_URL = process.env.VITE_API_URL;
}

export { API_URL };