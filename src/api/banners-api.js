import { handleApi, BASE_URLS } from "./axios";

const bannerApi = handleApi(BASE_URLS.BANNER);

// ADD
export const uploadMultipleBannersApi = (data) =>
    bannerApi.post("/upload-multi-images", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

// GET ALL
export const getBannersListApi = () =>
    bannerApi.get("/get-all-banner-images");

// DELETE
export const deleteMultipleBannersApi = (appBannerIds) =>
    bannerApi.delete("/delete-multi-images", {
        data: appBannerIds
    });
