import { handleApi, BASE_URLS } from "./axios";

const addToCartApi = handleApi(BASE_URLS.CART);

// ADD
export const addCartApi = (userId, productId) =>
    addToCartApi.post("/create-user-add-to-cart", null, {
        params: { userId, productId }
    });

// GET ALL
export const getAllCartsApi = (userId, productId) =>
    addToCartApi.get("/get-all-user-carts", {
        params: { userId, productId }
    });

// GET
export const getCartDetailsApi = (addToFavouriteId, userId) =>
    addToCartApi.get("/get-user-cart", {
        params: { addToFavouriteId, userId },
    });

// UPDATE
export const updateCartApi = (addToFavouriteId, userId, productId) =>
    addToCartApi.put("/update-user-cart", null, {
        params: { addToFavouriteId, userId, productId },
    });

// DELETE
export const deleteCartApi = (addToFavouriteId, userId) =>
    addToCartApi.delete("/remove-user-cart", {
        params: { addToFavouriteId, userId },
    });
