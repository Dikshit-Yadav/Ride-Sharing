import axios from "axios";

const API = axios.create({
  // baseURL: "https://ride-sharing-a2gh.onrender.com",
  baseURL: "http://localhost:4550",
  withCredentials: true 
});

export default API;
