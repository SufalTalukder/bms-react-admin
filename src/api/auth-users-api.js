import api from "./axios";

// ADD API
export const addAuthUserApi = (data) =>
    api.post("/create", data);

// GET ALL API
export const getAuthUsersListApi = () =>
    api.get("/get-all-auth-users");

// GET API
export const getAuthUserDetailsApi = (authUserId) =>
    api.get("/get-auth-details", {
        params: { authUserId },
    });

// UPDATE API
export const updateAuthUserApi = (authUserId, data) =>
    api.put("/update-details", data, {
        params: { authUserId }
    });

// DELETE API
export const deleteAuthUserApi = (rqstAuthUserId) =>
    api.delete("/delete", {
        params: { rqstAuthUserId },
    });