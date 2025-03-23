// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your backend URL if different

export const getLogs = () => {
  return axios.get(`${API_URL}/logs`);
};

export const createLog = (logData) => {
  return axios.post(`${API_URL}/logs`, logData);
};
