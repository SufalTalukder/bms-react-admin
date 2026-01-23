import { BASE_URLS, handleApi } from "./axios";

const authApi = handleApi(BASE_URLS.AUTH);

// GET ALL
export const getLoginAuditsApi = () =>
    authApi.get("/get-auth-login-audits");

// GET
export const getLoginAuditDetailsApi = (authLoginAuditId) =>
    authApi.get("/get-auth-login-audit-details", {
        params: { authLoginAuditId },
    });

