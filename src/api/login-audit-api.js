import api from "./axios";

export const getLoginAuditApi = () =>
    api.get("/get-auth-login-audit-details");

