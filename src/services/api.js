import axios from "axios";

const API = axios.create({
  baseURL: "https://student-portal-remainder-backend-1.onrender.com/api"
});

export default API;
