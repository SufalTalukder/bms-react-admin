import { BASE_URLS, handleApi } from "./axios";

const activityApi = handleApi(BASE_URLS.ACTIVITY);

// GET ALL
export const fetchAuthActivities = () =>
    activityApi.get("/get-auth-action-logs", {
        headers: {
            "Content-Type": "application/json"
        }
    });

