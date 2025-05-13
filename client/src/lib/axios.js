import axios from "axios";

// const PROD_URL = "https://cipher-mern-chat-app.vercel.app/api";
const PROD_URL = "/api";
const DEV_URL = "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: DEV_URL,
  withCredentials: true,
});

export default axiosInstance;
