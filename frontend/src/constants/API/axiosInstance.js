import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Optional: check if error message mentions token expiry
      if (error.response.data.message?.toLowerCase().includes("expired")) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        localStorage.removeItem("customerId");
        localStorage.clear();
        window.location.href = "/login";
       
      }
    }
    return Promise.reject(error);
  }
);

export default api;
