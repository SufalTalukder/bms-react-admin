import { handleApi, BASE_URLS } from "./axios";

const addToFavouriteApi = handleApi(BASE_URLS.FAVOURITE);

// ADD
export const addFavouriteApi = (userId, productId) =>
    addToFavouriteApi.post("/create-user-add-to-favourite", null, {
        params: { userId, productId }
    });

// GET ALL
export const getAllFavouritesApi = (userId, productId) =>
    addToFavouriteApi.get("/get-all-user-favourites", {
        params: { userId, productId }
    });

// GET
export const getFavouriteDetailsApi = (addToFavouriteId, userId) =>
    addToFavouriteApi.get("/get-user-favourite", {
        params: { addToFavouriteId, userId },
    });

// UPDATE
export const updateFavouriteApi = (addToFavouriteId, userId, productId) =>
    addToFavouriteApi.put("/update-user-favourite", null, {
        params: { addToFavouriteId, userId, productId },
    });

// DELETE
export const deleteFavouriteApi = (addToFavouriteId, userId) =>
    addToFavouriteApi.delete("/remove-user-favourite", {
        params: { addToFavouriteId, userId },
    });
