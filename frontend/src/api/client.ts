import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function getTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // zustand persist may store state under 'state' or at root depending on version
    return parsed?.token ?? parsed?.state?.token ?? null;
  } catch (err) {
    return null;
  }
}

const client = axios.create({
  baseURL: API_BASE + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `[API] Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default client;
