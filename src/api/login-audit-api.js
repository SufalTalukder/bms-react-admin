import api from "./axios";

// GET API
export const getLoginAuditApi = () =>
    api.get("/get-auth-login-audit-details");

