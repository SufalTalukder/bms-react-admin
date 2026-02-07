import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { DataTable } from "simple-datatables";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatDateTime, getSupportStatus, getTextPreview } from "./FunctionHelper";
import { toast } from "react-toastify";
import { addSupportApi, deleteSupportApi, getSupportDetailsApi, getSupportsListApi, updateSupportApi } from "../../api/supports-api";
import { getUsersListApi } from "../../api/users-api";
import profileImg from '/assets/img/profile-img.jpg';
import { SUPPORT_PAGE_TITLE } from "../../lang-dump/lang";

export default function SupportView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("Add Support");
    const [supportId, setSupportId] = useState(null);
    const [authUserName, setAuthUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [userProfileImg, setUserProfileImg] = useState("");
    const [supportText, setSupportText] = useState("");
    const [supportStatus, setSupportStatus] = useState("PENDING");
    const [filterByStatus, setFilterByStatus] = useState("");
    const [supportCreatedAt, setSupportCreatedAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [supportsList, setSupportsList] = useState([]);
    const [usersList, setUsersList] = useState([]);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = SUPPORT_PAGE_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchUsers();
    }, []);

    useEffect(() => {
        loadSupports();
    }, [filterByStatus]);

    // FETCH ALL SUPPORTS
    const loadSupports = async () => {
        try {
            setLoading(true);
            const res = await getSupportsListApi(
                filterByStatus || null
            );
            setSupportsList(
                res.data?.status === "success" ? res.data?.content : []
            );
        } catch (e) {
            setSupportsList([]);
        } finally {
            setLoading(false);
        }
    };

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsersListApi();
            setUsersList(res.data?.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && supportsList.length > 0) {
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
    }, [supportsList]);

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId.trim() || !supportText.trim() || !supportStatus.trim()) {
            toast.error("All fields are required.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("supportText", supportText);
        formData.append("supportStatus", supportStatus);

        try {
            setLoading(true);
            if (isAddModal) {
                await addSupportApi(userId, formData);
                toast.success("Support added successfully!");
            } else {
                await updateSupportApi(supportId, userId, formData);
                toast.success("Support updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                loadSupports();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save support.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setSupportId(null);
        setUserId("");
        setUserName("");
        setSupportText("");
        setSupportStatus("PENDING");
        setIsAddModal(true);
        setModalTitle("Add Support");
    };

    // EDIT SUPPORT
    const handleEdit = (id) => {
        const support = supportsList.find(l => l.supportId == id);
        if (!support) return;

        setIsAddModal(false);
        setModalOpen(true);
        setModalTitle("Update Support");
        setSupportId(support.supportId);
        setUserId(support.userInfo?.userId);
        setUserName(support.userInfo?.fullName);
        setSupportText(support.supportText);
        setSupportStatus(support.supportStatus);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE SUPPORT
    const handleDelete = async (sid, uid) => {
        try {
            await deleteSupportApi(sid, uid);
            toast.success("Support deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                loadSupports();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete support.");
        }
    };

    // VIEW SUPPORT
    const handleView = async (userId, supportId) => {
        try {
            const res = await getSupportDetailsApi(userId, supportId);
            const support = res.data.content;
            if (support) {
                setIsAddModal(false);
                setModalTitle("View Support Details");
                setSupportId(support.supportId);
                setAuthUserName(support.authUserInfo?.authUserName);
                setUserId(support.userInfo?.userId);
                setUserName(support.userInfo?.fullName);
                setSupportText(support.supportText);
                setSupportStatus(support.supportStatus);
                setSupportCreatedAt(support.supportCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error("Support info not found.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch support details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Supports</h1>
                        <div className="d-flex justify-content-end gap-2">
                            <select
                                className="btn btn-secondary"
                                value={filterByStatus}
                                onChange={(e) => setFilterByStatus(e.target.value)}
                                style={{ maxWidth: "170px" }}
                            >
                                <option value="">-- Status --</option>
                                <option value="PENDING">Pending</option>
                                <option value="ON_GOING">On Going</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    resetForm();
                                    setModalOpen(true);
                                    const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
                                    modal.show();
                                }}>
                                + Add Record
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
                                            <th>Support Details</th>
                                            <th>Raised By</th>
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={supportsList.length}>
                                        {loading &&
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Loading support(s)...</strong>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && supportsList.length === 0 &&
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    No support(s) found.
                                                </td>
                                            </tr>
                                        }
                                        {!loading &&
                                            supportsList.map((row, index) => (
                                                <tr key={`${row.supportId}-${row.supportCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="support-preview">
                                                            {getTextPreview(row.supportText, 300)}
                                                        </div>
                                                    </td>
                                                    <td>{row.userInfo?.fullName ?? '-'}</td>
                                                    <td>{row.authUserInfo?.authUserName ?? '-'}</td>
                                                    <td>{formatDateTime(row.supportCreatedAt)}</td>
                                                    <td>{getSupportStatus(row.supportStatus)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success rounded-pill me-1"
                                                            onClick={() => handleView(row.userInfo?.userId, row.supportId)}
                                                        >
                                                            👁️
                                                        </button>
                                                        <button className="btn btn-sm btn-info rounded-pill me-1"
                                                            data-id={row.supportId}
                                                            onClick={(e) => handleEdit(e.currentTarget.dataset.id)}>
                                                            ✏️
                                                        </button>
                                                        <button className="btn btn-sm btn-danger rounded-pill"
                                                            data-id={row.supportId}
                                                            data-uid={row.userInfo?.userId}
                                                            data-uname={row.userInfo?.fullName}
                                                            data-image={row.userInfo?.userImage}
                                                            onClick={(e) => {
                                                                setSupportId(e.currentTarget.dataset.id);
                                                                setUserId(e.currentTarget.dataset.uid);
                                                                setUserName(e.currentTarget.dataset.uname);
                                                                setUserProfileImg(e.currentTarget.dataset.image);
                                                                const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
                                                                modal.show();
                                                            }}>
                                                            🗑
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
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
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview">
                                        <div className="d-flex justify-content-center mb-4">
                                            <img src={userProfileImg ? `${import.meta.env.VITE_8081_API_BASE}/uploads/${userProfileImg}` : profileImg} alt="Profile" className="rounded-circle border" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">User</div>
                                            <div className="col-lg-9 col-md-8">{userName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Details</div>
                                            <div className="col-lg-9 col-md-8" style={{ wordWrap: "break-word" }}>
                                                <div className="ql-editor"
                                                    dangerouslySetInnerHTML={{ __html: supportText }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Active</div>
                                            <div className="col-lg-9 col-md-8">{getSupportStatus(supportStatus)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                            <div className="col-lg-9 col-md-8">{authUserName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(supportCreatedAt)}</div>
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
                <div className="modal-dialog modal-xl" style={{ maxHeight: "75vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="row g-3 p-3">
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select User *</label>
                                        <select className="form-select form-control" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            {usersList.map((row) => (
                                                <option key={`${row.userId}-${row.userCreatedAt}`} value={row.userId}>{row.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select form-control" value={supportStatus} onChange={(e) => setSupportStatus(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="ON_GOING">On Going</option>
                                            <option value="RESOLVED">Resolved</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12" style={{ textAlign: "left" }}>
                                        <label className="form-label">Write Down Your Reason *</label>
                                        {modalOpen &&
                                            <ReactQuill
                                                value={supportText}
                                                onChange={setSupportText}
                                                theme="snow"
                                            />
                                        }
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
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this Support of this user <strong>`{userName}`</strong>?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(supportId, userId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
