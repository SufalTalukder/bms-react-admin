import { handleApi, BASE_URLS } from "./axios";

const languageApi = handleApi(BASE_URLS.LANGUAGE);

// ADD
export const addLanguageApi = (data) =>
    languageApi.post("/create-language", data);

// GET ALL
export const getAllLanguagesApi = () =>
    languageApi.get("/get-all-languages");

// GET
export const getLanguageDetailsApi = (languageId) =>
    languageApi.get("/get-language", {
        params: { languageId },
    });

// UPDATE
export const updateLanguageApi = (languageId, data) =>
    languageApi.put("/update-language-details", data, {
        params: { languageId },
    });

// DELETE
export const deleteLanguageApi = (languageId) =>
    languageApi.delete("/delete-language", {
        params: { languageId },
    });
