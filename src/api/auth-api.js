import api from "./axios";

// POST API
export const loginApi = (email, password) =>
    api.post("/login", null, {
        params: {
            authUserEmailAddress: email,
            authUserPassword: password,
        },
    });

// GET API
export const getAuthUserApi = () =>
    api.get("/get-auth");
