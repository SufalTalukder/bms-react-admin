import { handleApi, BASE_URLS } from "./axios";

const categoryApi = handleApi(BASE_URLS.CATEGORY);

// ADD
export const addCategoryApi = (data) =>
    categoryApi.post("/create-category", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

// GET ALL
export const getCategoriesListApi = () =>
    categoryApi.get("/get-all-categories");

// GET
export const getCategoryDetailsApi = (categoryId) =>
    categoryApi.get("/get-category", {
        params: { categoryId },
    });

// UPDATE
export const updateCategoryApi = (categoryId, data) =>
    categoryApi.put("/update-category-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { categoryId },
    });

// DELETE
export const deleteCategoryApi = (categoryId) =>
    categoryApi.delete("/delete-category", {
        params: { categoryId },
    });
