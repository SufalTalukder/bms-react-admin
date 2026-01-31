import { handleApi, BASE_URLS } from "./axios";

const productApi = handleApi(BASE_URLS.PRODUCT);

// ADD
export const addProductApi = (categoryId, subCategoryId, languageId, data) =>
    productApi.post("/create-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { categoryId, subCategoryId, languageId }
    });

// GET ALL
export const getProductsListApi = (categoryId, subCategoryId, languageId) =>
    productApi.get("/get-all-products", {
        params: { categoryId, subCategoryId, languageId }
    });

// GET
export const getProductDetailsApi = (productId) =>
    productApi.get("/get-product", {
        params: { productId },
    });

// UPDATE
export const updateProductApi = (productId, categoryId, subCategoryId, languageId, data) =>
    productApi.put("/update-product-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { productId, categoryId, subCategoryId, languageId },
    });

// DELETE
export const deleteProductApi = (productId) =>
    productApi.delete("/delete-product", {
        params: { productId },
    });
