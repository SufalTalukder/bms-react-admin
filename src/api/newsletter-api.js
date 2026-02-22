import { handleApi, BASE_URLS } from "./axios";

const newsletterApi = handleApi(BASE_URLS.NEWSLETTER);

// ADD
export const addNewsletterApi = (data) =>
    newsletterApi.post("/create-newsletter", data);

// GET ALL
export const getNewslettersListApi = () =>
    newsletterApi.get("/get-all-newsletters");

// UPDATE
export const updateNewsletterApi = (newsletterId, data) =>
    newsletterApi.patch("/update-newsletter-details", data, {
        params: { newsletterId },
    });