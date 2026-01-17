import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { getLoginAuditApi } from "../../api/login-audit-api";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import "../../App.css";
import { removeLoaderIfExists, exportSQL, exportHTML, exportPDF, exportCSV, exportTXT } from "../../utils/table-export";

const TrackSystemActivityView = () => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Track Systems Activity | Admin Panel";
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
                        <h1 className="toggle-heading">Track Systems Activity</h1>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">
                            <div className="datatable-top d-flex gap-2 pb-4">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => { removeLoaderIfExists(tableRef); exportCSV(dataTableRef); }}>Export CSV</button>
                                <button className="btn btn-sm btn-outline-success" onClick={() => exportHTML(tableRef, "xls")}>Export Excel</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => exportPDF(tableRef)}>Export PDF</button>
                                <button className="btn btn-sm btn-outline-info" onClick={() => exportHTML(tableRef, "doc", "application/msword")}>Export DOC</button>
                                <button className="btn btn-sm btn-outline-warning" onClick={() => { removeLoaderIfExists(tableRef); exportTXT(dataTableRef); }}>Export TXT</button>
                                <button className="btn btn-sm btn-outline-dark" onClick={() => exportSQL(tableRef)}>Export SQL</button>
                            </div>
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
                                                    <strong className="ms-2">System Log(s) Loading...</strong>
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    No system log(s) found.
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
                                                    <td>{row.possibleIncognito ? "Yes" : "No"}</td>
                                                    <td>{row.loginTime}</td>
                                                    <td>{row.authUserInfo?.authUserName}</td>
                                                    <td>{row.createdAt}</td>
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
