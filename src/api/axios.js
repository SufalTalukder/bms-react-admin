import axios from "axios";

// Create a new Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
});

// Intercept every request and add headers
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            config.headers["authToken"] = token;
        }

        config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
        config.headers["x-api-secret"] = import.meta.env.VITE_API_SECRET;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
