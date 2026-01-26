import { handleApi, BASE_URLS } from "./axios";

const subCategoryApi = handleApi(BASE_URLS.SUB_CATEGORY);

// ADD
export const addSubCategoryApi = (data) =>
    subCategoryApi.post("/create-subcategory", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

// GET ALL
export const getSubCategoriesListApi = () =>
    subCategoryApi.get("/get-all-subcategory");

// GET
export const getSubCategoryDetailsApi = (subCategoryId) =>
    subCategoryApi.get("/get-subcategory", {
        params: { subCategoryId },
    });

// UPDATE
export const updateSubCategoryApi = (subCategoryId, data) =>
    subCategoryApi.put("/update-subcategory-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { subCategoryId },
    });

// DELETE
export const deleteSubCategoryApi = (subCategoryId) =>
    subCategoryApi.delete("/delete-subcategory", {
        params: { subCategoryId },
    });
