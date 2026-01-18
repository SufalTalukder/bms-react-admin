import { handleApi, BASE_URLS } from "./axios";

const userApi = handleApi(BASE_URLS.USER);

// ADD
export const addUserApi = (data) =>
    userApi.post("/create-user", data);

// GET ALL
export const getUsersListApi = () =>
    userApi.get("/get-users-list");

// GET
export const getUserDetailsApi = (userId) =>
    userApi.get("/get-user-details", {
        params: { userId },
    });

// UPDATE
export const updateUserApi = (userId, data) =>
    userApi.patch("/update-user-details", data, {
        params: { userId },
    });

// DELETE
export const deleteUserApi = (userId) =>
    userApi.delete("/delete-user", {
        params: { userId },
    });
