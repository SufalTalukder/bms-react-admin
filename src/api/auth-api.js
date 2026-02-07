import { BASE_URLS, handleApi } from "./axios";

const authApi = handleApi(BASE_URLS.AUTH);

// POST API
export const loginApi = (data) =>
    authApi.post("/login", data);

// GET API
export const getAuthUserApi = () =>
    authApi.get("/get-auth");

// LOGOUT API
export const logoutApi = (data) =>
    authApi.post("/logout", data);
