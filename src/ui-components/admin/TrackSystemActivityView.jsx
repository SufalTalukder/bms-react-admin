import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { getLoginAuditDetailsApi, getLoginAuditsApi } from "../../api/login-audit-api";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import "../../App.css";
import { formatDateTime } from "./FunctionHelper";
import { toast } from "react-toastify";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import {
    TRACK_SYSTEM_ACTIVITY_AUDIT_DETAILS_NOT_FOUND,
    TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGIN_AUDIT_DETAILS,
    TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGS,
    TRACK_SYSTEM_ACTIVITY_NO_SYSTEM_LOGS_FOUND, TRACK_SYSTEM_ACTIVITY_SYSTEM_LOGS_LOADING, TRACK_SYSTEM_ACTIVITY_SYSTEMS_ACTIVITY, TRACK_SYSTEM_ACTIVITY_TITLE,
    TRACK_SYSTEM_ACTIVITY_VIEW_LOGIN_AUDIT_DETAILS
} from "../../lang-dump/lang";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import profileImg from '../../assets/img/profile-img.jpg';

export default function TrackSystemActivityView() {

    // STATE VARIBALES
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBtnText, setModalBtnText] = useState("");
    const [authUserImage, setAuthUserImage] = useState(null);
    const [actionBy, setActionBy] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [userAgent, setUserAgent] = useState("");
    const [browser, setBrowser] = useState("");
    const [browserVersion, setBrowserVersion] = useState("");
    const [operatingSystem, setOperatingSystem] = useState("");
    const [osVersion, setOsVersion] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [deviceModel, setDeviceModel] = useState("");
    const [possibleIncognito, setPossibleIncognito] = useState(false);
    const [loginStatus, setLoginStatus] = useState("");
    const [authMethod, setAuthMethod] = useState("");
    const [failureReason, setFailureReason] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [referrerUrl, setReferrerUrl] = useState("");
    const [loginTime, setLoginTime] = useState("");
    const [createdAt, setAuthUserCreatedAt] = useState("");

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = TRACK_SYSTEM_ACTIVITY_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadSystemLogs();
    }, []);

    const loadSystemLogs = async () => {
        try {
            const res = await getLoginAuditsApi();
            setLogs(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error(TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && logs.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,

                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],

                columns: [
                    { select: 0, sort: "asc" }
                ]
            });
            document
                .querySelector("#demo-table")
                .addEventListener("click", (e) => {
                    const btn = e.target.closest(".view-btn");
                    if (btn) {
                        const id = btn.getAttribute("data-id");
                        handleView(id);
                    }
                });
        }
    }, [logs]);

    // VIEW SYSTEM AUDIT DETAILS
    const handleView = async (id) => {
        try {
            const res = await getLoginAuditDetailsApi(id);
            const authLoginAudit = res.data.content;
            if (authLoginAudit) {
                setModalTitle(TRACK_SYSTEM_ACTIVITY_VIEW_LOGIN_AUDIT_DETAILS);
                setModalBtnText("Ok");
                setAuthUserImage(authLoginAudit.authUserInfo?.authUserImage || null);
                setActionBy(authLoginAudit.authUserInfo?.authUserName || "-");
                setIpAddress(authLoginAudit.ipAddress || "-");
                setUserAgent(authLoginAudit.userAgent || "-");
                setBrowser(authLoginAudit.browser || "-");
                setBrowserVersion(authLoginAudit.browserVersion || "-");
                setOperatingSystem(authLoginAudit.operatingSystem || "-");
                setOsVersion(authLoginAudit.osVersion || "-");
                setDeviceType(authLoginAudit.deviceType || "-");
                setDeviceModel(authLoginAudit.deviceModel || "-");
                setPossibleIncognito(authLoginAudit.possibleIncognito || false);
                setLoginStatus(authLoginAudit.loginStatus || "-");
                setAuthMethod(authLoginAudit.authMethod || "-");
                setFailureReason(authLoginAudit.failureReason || "-");
                setSessionId(authLoginAudit.sessionId || "-");
                setReferrerUrl(authLoginAudit.referrerUrl || "-");
                setLoginTime(authLoginAudit.loginTime || "-");
                setAuthUserCreatedAt(authLoginAudit.createdAt || "-");
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error(TRACK_SYSTEM_ACTIVITY_AUDIT_DETAILS_NOT_FOUND);
            }
        } catch (error) {
            console.error(error);
            toast.error(TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGIN_AUDIT_DETAILS);
        } finally {
            setLoading(false);
        }
    };

    const refreshSystemLogs = () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        setLoading(true);
        loadSystemLogs();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">{TRACK_SYSTEM_ACTIVITY_SYSTEMS_ACTIVITY}</h1>
                        <button className="btn btn-secondary" onClick={() => refreshSystemLogs()} disabled={loading}>
                            <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                            Refresh
                        </button>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">
                            <ReusableExportTable
                                tableRef={tableRef}
                                dataTableRef={dataTableRef}
                            />

                            {loading && (
                                <div className="table-responsive system-log-table">
                                    <table
                                        ref={tableRef}
                                        className="table table-hover table-sm mb-0"
                                        id="demo-table"
                                    >
                                        <thead className="table-light">
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>IP Address</th>
                                                <th>User Agent</th>
                                                <th>Browser</th>
                                                <th>OS</th>
                                                <th>Device</th>
                                                <th>Incognito</th>
                                                <th>Login Time</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td colSpan="11" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">{TRACK_SYSTEM_ACTIVITY_SYSTEM_LOGS_LOADING}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {!loading && (
                                <div className="table-responsive system-log-table">
                                    <table
                                        ref={tableRef}
                                        className="table table-hover table-sm mb-0"
                                        id="demo-table"
                                    >
                                        <thead className="table-light">
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>IP Address</th>
                                                <th>User Agent</th>
                                                <th>Browser</th>
                                                <th>OS</th>
                                                <th>Device</th>
                                                <th>Incognito</th>
                                                <th>Login Time</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {logs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="11" className="text-center py-4">
                                                        {TRACK_SYSTEM_ACTIVITY_NO_SYSTEM_LOGS_FOUND}
                                                    </td>
                                                </tr>
                                            ) : (
                                                logs.map((row, index) => (
                                                    <tr key={`${row.authLoginAuditId}-${row.createdAt}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.ipAddress}</td>
                                                        <td className="text-truncate" style={{ maxWidth: 250 }}>
                                                            {row.userAgent}
                                                        </td>
                                                        <td>{row.browser}</td>
                                                        <td>{row.operatingSystem}</td>
                                                        <td>{row.deviceType}</td>
                                                        <td>
                                                            {row.possibleIncognito ? <span className="badge bg-success rounded">Yes</span> : <span className="badge bg-danger rounded">No</span>}
                                                        </td>
                                                        <td>{formatDateTime(row.loginTime)}</td>
                                                        <td>{row.authUserInfo?.authUserName}</td>
                                                        <td>{formatDateTime(row.createdAt)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-success rounded-pill me-1 view-btn"
                                                                data-id={row.authLoginAuditId}
                                                            >
                                                                👁️
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* VIEW MODAL */}
            <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: "65vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                            <div className="row g-3 p-3">
                                <div className="tab-content pt-0">
                                    <div className="tab-pane fade show active profile-overview">
                                        <div className="d-flex justify-content-center mb-4">
                                            <img src={authUserImage ? `${import.meta.env.VITE_8081_API_BASE}/uploads/${authUserImage}` : profileImg} alt="Profile" className="rounded-circle border" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">IP Address</div>
                                            <div className="col-lg-9 col-md-8">{ipAddress}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">User Agent</div>
                                            <div className="col-lg-9 col-md-8">{userAgent}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Browser</div>
                                            <div className="col-lg-9 col-md-8">{browser}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Browser Version</div>
                                            <div className="col-lg-9 col-md-8">{browserVersion}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">OS</div>
                                            <div className="col-lg-9 col-md-8">{operatingSystem}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">OS Version</div>
                                            <div className="col-lg-9 col-md-8">{osVersion}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Device Type</div>
                                            <div className="col-lg-9 col-md-8">{deviceType}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Device Model</div>
                                            <div className="col-lg-9 col-md-8">{deviceModel}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Incongnito Mode</div>
                                            <div className="col-lg-9 col-md-8">
                                                {possibleIncognito ? <span className="badge bg-success rounded">Yes</span> : <span className="badge bg-danger rounded">No</span>}
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Login Status</div>
                                            <div className="col-lg-9 col-md-8">{loginStatus}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Auth Method</div>
                                            <div className="col-lg-9 col-md-8">{authMethod}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Failure Reason</div>
                                            <div className="col-lg-9 col-md-8">{failureReason}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Session ID</div>
                                            <div className="col-lg-9 col-md-8">{sessionId}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Referrer URL</div>
                                            <div className="col-lg-9 col-md-8">{referrerUrl}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Login Time</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(loginTime)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                            <div className="col-lg-9 col-md-8">{actionBy}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(createdAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="view"
                            onCancel={() => { }}
                            submitText="view"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}