import axios from "axios";

export const baseUrl = "http://localhost:9000";

export const token = localStorage.getItem("token");

axios.interceptors.request.use((config: any) => {
  config.headers.common.Authorization = `Bearer ${token}`;
  config.baseURL = baseUrl;
  return config;
});

export default axios;
