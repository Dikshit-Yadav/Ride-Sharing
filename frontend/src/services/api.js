import axios from "axios";

const API = axios.create({
  baseURL: "https://ride-sharing-a2gh.onrender.com",
  withCredentials: true 
});

export default API;
