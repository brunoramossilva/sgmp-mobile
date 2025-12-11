import axios from "axios";

const baseURL = "http://192.168.15.8:3000";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;
