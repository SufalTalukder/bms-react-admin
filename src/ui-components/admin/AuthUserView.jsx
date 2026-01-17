import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { toast } from "react-toastify";
import "../../App.css";
import { removeLoaderIfExists, exportSQL, exportHTML, exportPDF, exportCSV, exportTXT } from "../../utils/table-export";
import { addAuthUserApi, deleteAuthUserApi, getAuthUsersListApi, updateAuthUserApi } from "../../api/auth-users-api";

const AuthUserView = () => {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add Auth User");
    const [authUserId, setAuthUserId] = useState(null);
    const [authUserName, setAuthUserName] = useState("");
    const [authUserEmail, setAuthUserEmail] = useState("");
    const [authUserPhone, setAuthUserPhone] = useState("");
    const [authUserPassword, setAuthUserPassword] = useState("");
    const [authUserType, setAuthUserType] = useState("");
    const [authUserActive, setAuthUserActive] = useState("YES");
    const [authUserImage, setAuthUserImage] = useState(null);
    const [authUsersList, setAuthUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Auth Users | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAuthUsers();
    }, []);

    // FETCH ALL AUTH USERS
    const fetchAuthUsers = async () => {
        try {
            setLoading(true);
            const res = await getAuthUsersListApi();
            setAuthUsersList(res.data.content || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && authUsersList.length > 0) {
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
    }, [loading, authUsersList]);

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!authUserName || !authUserEmail || !authUserPhone || !authUserType || !authUserActive) {
            toast.error("Please fill all required fields.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("authUserName", authUserName);
        formData.append("authUserEmailAddress", authUserEmail);
        formData.append("authUserPhoneNumber", authUserPhone);
        if (isAddModal && authUserPassword) formData.append("authUserPassword", authUserPassword);
        formData.append("authUserType", authUserType);
        formData.append("authUserActive", authUserActive);
        if (authUserImage) formData.append("authUserImage", authUserImage);

        try {
            if (isAddModal) {
                await addAuthUserApi(formData);
                toast.success("Auth user added successfully!");
            } else {
                await updateAuthUserApi(authUserId, formData);
                toast.success("Auth user updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                // fetchAuthUsers();
                location.reload();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save auth user.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setAuthUserId(null);
        setAuthUserName("");
        setAuthUserEmail("");
        setAuthUserPhone("");
        setAuthUserPassword("");
        setAuthUserType("");
        setAuthUserActive("YES");
        setAuthUserImage(null);
        setIsAddModal(true);
        setModalTitle("Add Auth User");
    };

    // EDIT AUTH USER
    const handleEdit = (user) => {
        setIsAddModal(false);
        setModalTitle("Update Auth User");
        setAuthUserId(user.authUserId);
        setAuthUserName(user.authUserName);
        setAuthUserEmail(user.authUserEmailAddress);
        setAuthUserPhone(user.authUserPhoneNumber);
        setAuthUserPassword("");
        setAuthUserType(user.authUserType);
        setAuthUserActive(user.authUserActive);
        setAuthUserImage(null);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE AUTH USER
    const handleDelete = async (id) => {
        try {
            await deleteAuthUserApi(id);
            toast.success("Auth user deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                // fetchAuthUsers();
                location.reload();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete auth user.");
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Auth Users</h1>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                resetForm();
                                const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
                                modal.show();
                            }}>
                            + Add Record
                        </button>
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
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Ph. No.</th>
                                            <th>Type</th>
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={authUsersList.length}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Auth User(s) Loading...</strong>
                                                </td>
                                            </tr>
                                        ) : authUsersList.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    No auth user(s) found.
                                                </td>
                                            </tr>
                                        ) : (
                                            authUsersList.map((row, index) => (
                                                <tr key={`${row.authUserId}-${row.authUserCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.authUserImage}</td>
                                                    <td>{row.authUserName}</td>
                                                    <td>{row.authUserEmailAddress}</td>
                                                    <td>{row.authUserPhoneNumber}</td>
                                                    <td>{row.authUserType}</td>
                                                    <td>{row.actionByUserInfo?.authUserName}</td>
                                                    <td>{row.authUserCreatedAt}</td>
                                                    <td>{row.authUserActive}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-info rounded-pill me-1"
                                                            onClick={() => handleEdit(row)}>
                                                            ✏️
                                                        </button>
                                                        <button className="btn btn-sm btn-danger rounded-pill"
                                                            onClick={() => {
                                                                setAuthUserId(row.authUserId);
                                                                setAuthUserName(row.authUserName);
                                                                const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
                                                                modal.show();
                                                            }}>
                                                            🗑
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

            {/* ADD MODAL */}
            {/* OR, UPDATE MODAL */}
            <div className="modal fade" id="addUpdateModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="row g-3 p-3">
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authName" className="form-label">Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={authUserName} onChange={(e) => setAuthUserName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authEmail" className="form-label">Email *</label>
                                        <input type="email" className="form-control" maxLength="50" value={authUserEmail} onChange={(e) => setAuthUserEmail(e.target.value)} autoComplete="new-email" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authPhone" className="form-label">Phone Number *</label>
                                        <input type="text" className="form-control" minLength="10" maxLength="10" value={authUserPhone} onChange={(e) => setAuthUserPhone(e.target.value)} autoComplete="new-phone-number" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authPassword" className="form-label">Password {isAddModal ? "*" : "(Leave blank to keep unchanged)"}</label>
                                        <input type="password" className="form-control" maxLength="50" value={authUserPassword} onChange={(e) => setAuthUserPassword(e.target.value)} autoComplete="new-password" required={isAddModal} />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authType" className="form-label">Type *</label>
                                        <select className="form-select" value={authUserType} onChange={(e) => setAuthUserType(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="SUPER_ADMIN">Super Admin</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authActive" className="form-label">Active *</label>
                                        <select className="form-select" value={authUserActive} onChange={(e) => setAuthUserActive(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="YES">Yes</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label htmlFor="authImage" className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setAuthUserImage(e.target.files[0])}
                                            accept=".jpg,.jpeg,.png"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={loading}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : "Save"}
                                    {loading ? "Saving..." : ""}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true"
                data-bs-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this "{authUserName}" Auth?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDelete(authUserId)}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AuthUserView;

