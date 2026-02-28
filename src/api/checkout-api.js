import { BASE_URLS, handleApi } from "./axios";

const checkoutApi = handleApi(BASE_URLS.CHECKOUT);

// GET ALL
export const getAllCheckoutHistoriesApi = () =>
    checkoutApi.get("/get-all-checkout-histories");

// GET
export const getCheckoutDetailsApi = (checkOutHistoryId) =>
    checkoutApi.get("/get-checkout-details", {
        params: { checkOutHistoryId }
    });

