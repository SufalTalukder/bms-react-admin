import { handleApi, BASE_URLS } from "./axios";

const authApi = handleApi(BASE_URLS.AUTH);

// ADD
export const addAuthUserApi = (data) =>
    authApi.post("/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

// GET ALL
export const getAuthUsersListApi = () =>
    authApi.get("/get-all-auth-users");

// GET
export const getAuthUserDetailsApi = (authUserId) =>
    authApi.get("/get-auth-details", {
        params: { authUserId },
    });

// UPDATE
export const updateAuthUserApi = (authUserId, data) =>
    authApi.put("/update-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { authUserId },
    });

// DELETE
export const deleteAuthUserApi = (rqstAuthUserId) =>
    authApi.delete("/delete", {
        params: { rqstAuthUserId },
    });
