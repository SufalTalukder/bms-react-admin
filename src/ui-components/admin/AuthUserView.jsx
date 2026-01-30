import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { toast } from "react-toastify";
import "../../App.css";
import { addAuthUserApi, deleteAuthUserApi, getAuthUserDetailsApi, getAuthUsersListApi, updateAuthUserApi } from "../../api/auth-users-api";
import profileImg from '../../assets/img/profile-img.jpg';
import toasterMsgDisplay, { formatDateTime, getActiveStatus, getAuthUserType } from "./FunctionHelper";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import {
    ADD_RECORD, ALL_FIELDS_ARE_REQUIRED, AUTH_USER, AUTH_USER_ADD_AUTH_USER, AUTH_USER_AUTH_USERS_LOADING, AUTH_USER_EDIT_AUTH_USER, AUTH_USER_INVALID_PASSWORD, AUTH_USER_MANAGE_AUTH_USERS, AUTH_USER_NO_AUTH_USERS_FOUND, AUTH_USER_SAVING, AUTH_USER_TITLE, AUTH_USER_UPDATING, INVALID_EMAIL_ADDRESS, INVALID_NAMING_CONVENSION, INVALID_PHONE_NUMBER, OK_BUTTON
} from "../../lang-dump/lang";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import validationChecker from "../../utils/validations-checker";

export default function AuthUserView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState(AUTH_USER_ADD_AUTH_USER);
    const [modalBtnText, setModalBtnText] = useState(AUTH_USER_SAVING);
    const [authUserId, setAuthUserId] = useState(null);
    const [authUserName, setAuthUserName] = useState("");
    const [actionBy, setActionBy] = useState("");
    const [authUserEmail, setAuthUserEmail] = useState("");
    const [authUserPhone, setAuthUserPhone] = useState("");
    const [authUserPassword, setAuthUserPassword] = useState("");
    const [authUserType, setAuthUserType] = useState("");
    const [authUserActive, setAuthUserActive] = useState("YES");
    const [authUserImage, setAuthUserImage] = useState(null);
    const [authUserCreatedAt, setAuthUserCreatedAt] = useState("");
    const [authUsersList, setAuthUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = AUTH_USER_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadAuthUsers();
    }, []);

    // FETCH ALL AUTH USERS
    const loadAuthUsers = async () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        try {
            setLoading(true);
            const res = await getAuthUsersListApi();
            setAuthUsersList(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error(toasterMsgDisplay('view_all', AUTH_USER));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && authUsersList.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,

                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],

                columns: [
                    { select: 0, sort: "asc" }
                ]
            });
        }
    }, [authUsersList]);

    // VIEW AUTH USER
    const handleView = async (id) => {
        try {
            const res = await getAuthUserDetailsApi(id);
            const authUser = res.data.content;
            if (authUser) {
                setIsAddModal(false);
                setModalTitle(toasterMsgDisplay('view', AUTH_USER));
                setModalBtnText(OK_BUTTON);
                setAuthUserId(authUser.authUserId);
                setAuthUserName(authUser.authUserName);
                setActionBy(authUser.actionByUserInfo?.authUserName);
                setAuthUserEmail(authUser.authUserEmailAddress);
                setAuthUserPhone(authUser.authUserPhoneNumber);
                setAuthUserType(authUser.authUserType);
                setAuthUserActive(authUser.authUserActive);
                setAuthUserCreatedAt(authUser.authUserCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error(toasterMsgDisplay('not_found', AUTH_USER));
            }
        } catch (error) {
            console.error(error);
            toast.error(toasterMsgDisplay('failed_r', AUTH_USER));
        } finally {
            setLoading(false);
        }
    };

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!authUserName.trim() || !authUserEmail.trim() || !authUserPhone.trim() || !authUserType || !authUserActive) {
            toast.error(ALL_FIELDS_ARE_REQUIRED);
            setLoading(false);
            return;
        }
        if (!validationChecker('text', authUserName.trim())) {
            toast.error(INVALID_NAMING_CONVENSION);
            setLoading(false);
            return;
        }
        if (!validationChecker('email', authUserEmail.trim())) {
            toast.error(INVALID_EMAIL_ADDRESS);
            setLoading(false);
            return;
        }
        if (!validationChecker('phone', authUserPhone.trim())) {
            toast.error(INVALID_PHONE_NUMBER);
            setLoading(false);
            return;
        }
        if (isAddModal && !validationChecker('password', authUserPassword.trim())) {
            toast.error(AUTH_USER_INVALID_PASSWORD);
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
                toast.success(toasterMsgDisplay('add', AUTH_USER));
            } else {
                await updateAuthUserApi(authUserId, formData);
                toast.success(toasterMsgDisplay('update', AUTH_USER));
            }
            setTimeout(() => {
                resetForm();
                loadAuthUsers();
                // location.reload();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error(toasterMsgDisplay('failed_cud', 'save', AUTH_USER));
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
        setModalTitle(AUTH_USER_ADD_AUTH_USER);
    };

    // EDIT AUTH USER
    const handleEdit = (authUser) => {
        setIsAddModal(false);
        setModalTitle(AUTH_USER_EDIT_AUTH_USER);
        setModalBtnText(AUTH_USER_UPDATING);
        setAuthUserId(authUser.authUserId);
        setAuthUserName(authUser.authUserName);
        setAuthUserEmail(authUser.authUserEmailAddress);
        setAuthUserPhone(authUser.authUserPhoneNumber);
        setAuthUserPassword("");
        setAuthUserType(authUser.authUserType);
        setAuthUserActive(authUser.authUserActive);
        setAuthUserImage(null);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE AUTH USER
    const handleDelete = async (id) => {
        try {
            await deleteAuthUserApi(id);
            toast.success(toasterMsgDisplay('delete', AUTH_USER));

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                loadAuthUsers();
                // location.reload();
            }, 1000);
        } catch (error) {
            toast.error(toasterMsgDisplay('failed_cud', 'delete', AUTH_USER));
        }
    };

    const refreshAuthUsers = () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        setLoading(true);
        loadAuthUsers();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <div className="text-left">
                            <h1 className="toggle-heading">{AUTH_USER_MANAGE_AUTH_USERS}</h1>
                        </div>
                        <div className="text-right">
                            <button className="btn btn-secondary" onClick={() => refreshAuthUsers()} disabled={loading} style={{ marginRight: '10px' }}>
                                <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                                Refresh
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    resetForm();
                                    const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
                                    modal.show();
                                }}>
                                {ADD_RECORD}
                            </button>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">
                            <ReusableExportTable
                                tableRef={tableRef}
                                dataTableRef={dataTableRef}
                            />

                            {loading &&
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

                                        <tbody>
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">{AUTH_USER_AUTH_USERS_LOADING}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }

                            {!loading &&
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
                                            {authUsersList.length === 0 ? (
                                                <tr>
                                                    <td colSpan="10" className="text-center py-4">
                                                        {AUTH_USER_NO_AUTH_USERS_FOUND}
                                                    </td>
                                                </tr>
                                            ) : (
                                                authUsersList.map((row, index) => (
                                                    <tr key={`${row.authUserId}-${row.authUserCreatedAt}`}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={row.authUserImage ? `${import.meta.env.VITE_8082_API_BASE}/uploads/${row.authUserImage}` : profileImg} style={{ maxHeight: "70px", maxWidth: "80px" }} alt="authImage" />
                                                        </td>
                                                        <td>{row.authUserName}</td>
                                                        <td>{row.authUserEmailAddress}</td>
                                                        <td>{row.authUserPhoneNumber}</td>
                                                        <td>{getAuthUserType(row.authUserType)}</td>
                                                        <td>{row.actionByUserInfo?.authUserName}</td>
                                                        <td>{formatDateTime(row.authUserCreatedAt)}</td>
                                                        <td>{getActiveStatus(row.authUserActive)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-success rounded-pill me-1"
                                                                onClick={() => handleView(row.authUserId)}
                                                            >
                                                                👁️
                                                            </button>
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
                            }
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
                                            <div className="col-lg-3 col-md-4 fw-bold">Full Name</div>
                                            <div className="col-lg-9 col-md-8">{authUserName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Email</div>
                                            <div className="col-lg-9 col-md-8">{authUserEmail}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Phone</div>
                                            <div className="col-lg-9 col-md-8">{authUserPhone}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                            <div className="col-lg-9 col-md-8">{actionBy}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Type</div>
                                            <div className="col-lg-9 col-md-8">{getAuthUserType(authUserType)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Active</div>
                                            <div className="col-lg-9 col-md-8">{getActiveStatus(authUserActive)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(authUserCreatedAt)}</div>
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

            {/* ADD MODAL */}
            {/* OR, UPDATE MODAL */}
            <div className="modal fade" id="addUpdateModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                            <ReusableModalButtons
                                loading={loading}
                                mode={isAddModal ? "add" : "edit"}
                                onCancel={resetForm}
                                submitText={isAddModal ? "Save" : "Update"}
                            />
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
                            <p>Are you sure you want to delete this `{authUserName}` Auth?</p>
                        </div>
                        <ReusableModalButtons
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(authUserId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
