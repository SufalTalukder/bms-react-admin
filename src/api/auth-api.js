import { BASE_URLS, handleApi } from "./axios";

const authApi = handleApi(BASE_URLS.AUTH);

// POST API
export const loginApi = (email, password) =>
    authApi.post("/login", null, {
        params: {
            authUserEmailAddress: email,
            authUserPassword: password,
        },
    });

// GET API
export const getAuthUserApi = () =>
    authApi.get("/get-auth");
