import { handleApi, BASE_URLS } from "./axios";

const notificationApi = handleApi(BASE_URLS.NOTIFICATION);

// ADD
export const pushNotificationApi = (data) =>
    notificationApi.post("/push-mgmt-notification", data);

// GET ALL
export const getAllNotificationsApi = () =>
    notificationApi.get("/get-all-mgmt-notifications");

// UPDATE
export const updateNotificationApi = (notificationId) =>
    notificationApi.patch("/update-mgmt-notification", {
        params: { notificationId },
    });

// DELETE
export const removeNotificationApi = (notificationId) =>
    notificationApi.delete("/remove-mgmt-notification", {
        params: { notificationId },
    });
