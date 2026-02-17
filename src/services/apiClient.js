

// // src/services/apiClient.js
// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_API_URL ||  "http://localhost:5000/api",
//   withCredentials: true,
// });

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     // The key is to add /api here to all requests
//     if (!config.url.startsWith('/api')) {
//       config.url = `/api${config.url}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor (no changes needed here, just for context)
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const response = await apiClient.post(
//           `${process.env.REACT_APP_API_URL || ''}/api/auth/refresh`, // This should be updated if you change your baseURL
//           {},
//           { withCredentials: true }
//         );
//         const newToken = response.data.token;
//         localStorage.setItem('token', newToken);
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         localStorage.clear();
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// src/services/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 🔹 Log every outgoing request
    console.log(
      "[API Request]",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // 🔹 Log every successful response
    console.log(
      "[API Response]",
      response.status,
      response.config.url,
      response.data
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔹 Log errors
    console.error(
      "[API Error]",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiClient.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
