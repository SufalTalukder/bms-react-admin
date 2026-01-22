import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { getLoginAuditApi } from "../../api/login-audit-api";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import "../../App.css";
import { formatDateTime } from "./FunctionHelper";
import { toast } from "react-toastify";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import {
    TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGS,
    TRACK_SYSTEM_ACTIVITY_NO_SYSTEM_LOGS_FOUND, TRACK_SYSTEM_ACTIVITY_SYSTEM_LOGS_LOADING, TRACK_SYSTEM_ACTIVITY_SYSTEMS_ACTIVITY, TRACK_SYSTEM_ACTIVITY_TITLE
} from "../../lang-dump/lang";

const TrackSystemActivityView = () => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = TRACK_SYSTEM_ACTIVITY_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await getLoginAuditApi();
            setLogs(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error(TRACK_SYSTEM_ACTIVITY_FAILED_TO_FETCH_LOGS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && logs.length > 0) {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
            }

            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,
                perPage: 10,
                // fixedHeight: true
            });
        }
    }, [loading, logs]);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">{TRACK_SYSTEM_ACTIVITY_SYSTEMS_ACTIVITY}</h1>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">
                            <ReusableExportTable
                                tableRef={tableRef}
                                dataTableRef={dataTableRef}
                            />
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
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">{TRACK_SYSTEM_ACTIVITY_SYSTEM_LOGS_LOADING}</strong>
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
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
                                                    <td>{row.possibleIncognito ? <span className="badge bg-success rounded">Yes</span> : <span className="badge bg-danger rounded">No</span>}</td>
                                                    <td>{formatDateTime(row.loginTime)}</td>
                                                    <td>{row.authUserInfo?.authUserName}</td>
                                                    <td>{formatDateTime(row.createdAt)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default TrackSystemActivityView;
