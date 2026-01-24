import axios from "axios";

/**
 * Centralized service base URLs
 */
export const BASE_URLS = {
    AUTH: import.meta.env.VITE_8082_API_BASE,
    USER: import.meta.env.VITE_8081_API_BASE,
    BANNER: import.meta.env.VITE_8083_API_BASE,
    LANGUAGE: import.meta.env.VITE_8088_API_BASE
};

/**
 * Common interceptor logic
 */
const applyInterceptors = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem("authToken");

            if (token) {
                config.headers.authToken = token;
            }

            config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
            config.headers["x-api-secret"] = import.meta.env.VITE_API_SECRET;

            return config;
        },
        (error) => Promise.reject(error)
    );

    return instance;
};

/**
 * Axios factory function
 */
export const handleApi = (baseURL) => {
    const instance = axios.create({
        baseURL,
        timeout: 15000,
    });

    return applyInterceptors(instance);
};
