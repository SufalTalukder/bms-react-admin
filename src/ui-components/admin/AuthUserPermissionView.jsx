import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { toast } from "react-toastify";
import { getAuthPermissionListApi, grantAuthPermissionApi } from "../../api/auth-users-api";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";

export default function AuthUserPermissionView() {

    const [savingId, setSavingId] = useState(null);

    const [permissionsList, setPermissionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Auth Permissions - BMS Book Store";
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadPermissions();
    }, []);

    // FETCH ALL PERMISSIONS
    const loadPermissions = async () => {
        try {
            setLoading(true);
            const res = await getAuthPermissionListApi();
            setPermissionsList(res.data?.content || []);
        } catch (e) {
            toast.error("Failed to load records!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && permissionsList.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,
                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],
                columns: [{ select: 0, sort: "asc" }]
            });
        }
    }, [permissionsList]);

    // CHECKBOX HANDLER
    const handleCheckboxChange = (id, field, checked) => {
        const updatedList = permissionsList.map((item) =>
            item.authPermissionId === id
                ? { ...item, [field]: checked ? "YES" : "NO" }
                : item
        );
        setPermissionsList(updatedList);
    };

    // SAVE PERMISSION
    const handlePermission = async (row) => {
        const data = {
            authPermissionId: row.authPermissionId,
            addPermission: row.addPermission,
            viewAllPermission: row.viewAllPermission,
            viewPermission: row.viewPermission,
            editPermission: row.editPermission,
            deletePermission: row.deletePermission,
        };

        try {
            setSavingId(row.authPermissionId);
            await grantAuthPermissionApi(data);
            toast.success("Permission saved successfully!");
            await loadPermissions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save permission!");
        } finally {
            setSavingId(null);
        }
    };

    const refreshTable = () => {
        setLoading(true);
        loadPermissions();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <div className="text-left">
                            <h1 className="toggle-heading">Manage Auth Permissions</h1>
                        </div>
                        <div className="text-right">
                            <button
                                className="btn btn-secondary"
                                onClick={refreshTable}
                                disabled={loading}
                                style={{ marginRight: '10px' }}
                            >
                                <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                                Refresh
                            </button>
                        </div>
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
                                            <th>#Sr. No.</th>
                                            <th>Name</th>
                                            <th>Add Permission</th>
                                            <th>View All Permission</th>
                                            <th>View Permission</th>
                                            <th>Edit Permission</th>
                                            <th>Delete Permission</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Loading...</strong>
                                                </td>
                                            </tr>
                                        ) : permissionsList.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    No record(s) found!
                                                </td>
                                            </tr>
                                        ) : (
                                            permissionsList.map((row, index) => (
                                                <tr key={`${row.authPermissionId}-${row.authPermissionCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.authUserInfo?.authUserName}</td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={row.addPermission === "YES"}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    row.authPermissionId,
                                                                    "addPermission",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                            &nbsp;{row.addPermission === "YES" ? "Yes" : "No"}
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={row.viewAllPermission === "YES"}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    row.authPermissionId,
                                                                    "viewAllPermission",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                            &nbsp;{row.viewAllPermission === "YES" ? "Yes" : "No"}
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={row.viewPermission === "YES"}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    row.authPermissionId,
                                                                    "viewPermission",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                            &nbsp;{row.viewPermission === "YES" ? "Yes" : "No"}
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={row.editPermission === "YES"}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    row.authPermissionId,
                                                                    "editPermission",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                            &nbsp;{row.editPermission === "YES" ? "Yes" : "No"}
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={row.deletePermission === "YES"}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    row.authPermissionId,
                                                                    "deletePermission",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="gridCheck2">
                                                            &nbsp;{row.deletePermission === "YES" ? "Yes" : "No"}
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handlePermission(row)}
                                                            disabled={savingId === row.authPermissionId}
                                                        >
                                                            {savingId === row.authPermissionId ? (
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                "Save"
                                                            )}
                                                        </button>
                                                    </td>
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
}