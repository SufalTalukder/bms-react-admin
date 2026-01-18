import { BASE_URLS, handleApi } from "./axios";

const authApi = handleApi(BASE_URLS.AUTH);

// GET API
export const getLoginAuditApi = () =>
    authApi.get("/get-auth-login-audit-details");

