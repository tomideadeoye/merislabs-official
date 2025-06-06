import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
