import { handleApi, BASE_URLS } from "./axios";

const supportApi = handleApi(BASE_URLS.SUPPORT);

// ADD
export const addSupportApi = (userId, data) =>
    supportApi.post("/add-user-support", data, {
        params: { userId },
    });

// GET ALL
export const getSupportsListApi = (supportStatus) =>
    supportApi.get("/get-all-user-supports", {
        params: { supportStatus },
    });

// GET
export const getSupportDetailsApi = (userId, supportId) =>
    supportApi.get("/get-user-support-details", {
        params: { userId, supportId },
    });

// UPDATE
export const updateSupportApi = (supportId, userId, data) =>
    supportApi.put("/update-user-support-details", data, {
        params: { supportId, userId },
    });

// DELETE
export const deleteSupportApi = (supportId, userId) =>
    supportApi.delete("/delete-user-support-details", {
        params: { supportId, userId },
    });
