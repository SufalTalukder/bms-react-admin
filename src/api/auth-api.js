import api from "./axios";

export const loginApi = (email, password) =>
    api.post("/login", null, {
        params: {
            authUserEmailAddress: email,
            authUserPassword: password,
        },
    });

export const getAuthUserApi = () =>
    api.get("/get-auth");
