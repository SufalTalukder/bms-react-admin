import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

/**
 * Centralized service base URLs
 */
export const BASE_URLS = {
    ACTIVITY: import.meta.env.VITE_8095_API_BASE,
    AUTH: import.meta.env.VITE_8082_API_BASE,
    USER: import.meta.env.VITE_8081_API_BASE,
    BANNER: import.meta.env.VITE_8083_API_BASE,
    LANGUAGE: import.meta.env.VITE_8088_API_BASE,
    CATEGORY: import.meta.env.VITE_8084_API_BASE,
    SUB_CATEGORY: import.meta.env.VITE_8085_API_BASE,
    PRODUCT: import.meta.env.VITE_8086_API_BASE,
    CHECKOUT: import.meta.env.VITE_8087_API_BASE,
    NEWSLETTER: import.meta.env.VITE_8089_API_BASE,
    FAVOURITE: import.meta.env.VITE_8091_API_BASE,
    CART: import.meta.env.VITE_8092_API_BASE,
    NOTIFICATION: import.meta.env.VITE_8093_API_BASE,
    SUPPORT: import.meta.env.VITE_8100_API_BASE,
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};

/**
 * Common interceptor logic
 */
export const applyInterceptors = (instance) => {

    instance.interceptors.request.use(config => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            config.headers.authToken = token;
        }

        config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
        config.headers["x-api-secret"] = import.meta.env.VITE_API_SECRET;

        return config;
    });

    instance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.authToken = token;
                        return instance(originalRequest);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshToken =
                        localStorage.getItem("refreshToken") ||
                        sessionStorage.getItem("refreshToken");

                    const res = await axios.post(
                        `${import.meta.env.VITE_8082_API_BASE}/refresh-token`,
                        { refreshToken },
                        {
                            headers: {
                                "x-api-key": import.meta.env.VITE_API_KEY,
                                "x-api-secret": import.meta.env.VITE_API_SECRET
                            }
                        }
                    );

                    const newAccessToken = res.data?.content?.accessToken;

                    sessionStorage.setItem("accessToken", newAccessToken);
                    processQueue(null, newAccessToken);

                    originalRequest.headers.authToken = newAccessToken;

                    return instance(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    sessionStorage.clear();
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/bms-book-store/admin/login";
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
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
