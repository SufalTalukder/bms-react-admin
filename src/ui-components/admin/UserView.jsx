import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { toast } from "react-toastify";
import "../../App.css";
import { addUserApi, getUsersListApi, updateUserApi, deleteUserApi, getUserDetailsApi } from "../../api/users-api";
import profileImg from '../../assets/img/profile-img.jpg';
import { formatDateTime, formatDOB, getActiveStatus } from "./FunctionHelper";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";

const UserView = () => {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add User");
    const [modalBtnText, setModalBtnText] = useState("Saving...");
    const [userId, setUserId] = useState(null);
    const [fullName, setUserName] = useState("");
    const [emailAddress, setUserEmail] = useState("");
    const [phoneNumber, setUserPhone] = useState("");
    const [dob, setUserDob] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userReferralCode, setUserReferralCode] = useState("");
    const [userActive, setUserActive] = useState("YES");
    const [userImage, setUserImage] = useState(null);
    const [userCreatedAt, setUserCreatedAt] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Users | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchUsers();
    }, []);

    // FETCH ALL USERS
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsersListApi();
            setUsersList(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && usersList.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,
                perPage: 10
            });
        }
    }, [usersList.length]);

    // VIEW USER
    const handleView = async (id) => {
        try {
            const res = await getUserDetailsApi(id);
            const user = res.data.content;
            if (user) {
                setIsAddModal(false);
                setModalTitle("View User Details");
                setModalBtnText("Ok");
                setUserId(user.userId);
                setUserName(user.fullName);
                setUserEmail(user.emailAddress);
                setUserPhone(user.phoneNumber);
                setUserDob(user.dob);
                setUserAddress(user.userAddress);
                setUserReferralCode(user.userReferralCode);
                setUserActive(user.userActive);
                setUserImage(user.userImage);
                setUserCreatedAt(user.userCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error("User not found.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch user details.");
        } finally {
            setLoading(false);
        }
    };

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!fullName.trim() || !emailAddress.trim() || !phoneNumber.trim() || !userAddress.trim() || !dob.trim() || !userActive) {
            toast.error("Please fill all required fields.");
            setLoading(false);
            return;
        }
        if (!validateEmail(emailAddress.trim())) {
            toast.error("Invalid email address.");
            setLoading(false);
            return;
        }
        if (!validatePhoneNumber(phoneNumber.trim())) {
            toast.error("Invalid phone number. It should be 10 digits.");
            setLoading(false);
            return;
        }
        if (!validateDOB(dob.trim())) {
            toast.error("User must be at least 18 years old.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("phoneNumber", phoneNumber);
        formData.append("emailAddress", emailAddress);
        formData.append("dob", dob);
        formData.append("userAddress", userAddress);
        formData.append("userActive", userActive);
        if (userImage) formData.append("userImage", userImage);

        try {
            if (isAddModal) {
                await addUserApi(formData);
                toast.success("User added successfully!");
            } else {
                await updateUserApi(userId, formData);
                toast.success("User updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                fetchUsers();
                // location.reload();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save user.");
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phoneNumber) => {
        const re = /^\d{10}$/;
        return re.test(String(phoneNumber));
    }

    const validateDOB = (dob) => {
        const date = new Date(dob);
        const ageDiff = Date.now() - date.getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 18;
    };

    // RESET FORM
    const resetForm = () => {
        setUserId(null);
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setUserDob("");
        setUserAddress("");
        setUserActive("YES");
        setUserImage(null);
        setIsAddModal(true);
        setModalTitle("Add User");
    };

    // EDIT USER
    const handleEdit = (user) => {
        setIsAddModal(false);
        setModalTitle("Update User");
        setModalBtnText("Updating...");
        setUserId(user.userId);
        setUserName(user.fullName);
        setUserEmail(user.emailAddress);
        setUserPhone(user.phoneNumber);
        setUserDob(user.dob);
        setUserAddress(user.userAddress);
        setUserActive(user.userActive);
        setUserImage(user.userImage);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE USER
    const handleDelete = async (id) => {
        try {
            await deleteUserApi(id);
            toast.success("User deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                fetchUsers();
                // location.reload();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete user.");
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Users</h1>
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
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Ph. No.</th>
                                            <th>Email</th>
                                            <th>DOB</th>
                                            <th>Address</th>
                                            <th>Referral Code</th>
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={usersList.length}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="12" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">User(s) Loading...</strong>
                                                </td>
                                            </tr>
                                        ) : usersList.length === 0 ? (
                                            <tr>
                                                <td colSpan="12" className="text-center py-4">
                                                    No user(s) found.
                                                </td>
                                            </tr>
                                        ) : (
                                            usersList.map((row, index) => (
                                                <tr key={`${row.userId}-${row.userCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img src={row.userImage ? `${import.meta.env.VITE_8081_API_BASE}/uploads/${row.userImage}` : profileImg} style={{ maxHeight: "70px", maxWidth: "80px" }} alt="userImage" />
                                                    </td>
                                                    <td>{row.fullName}</td>
                                                    <td>{row.phoneNumber}</td>
                                                    <td className="text-truncate" style={{ maxWidth: 250 }}>
                                                        {row.emailAddress}
                                                    </td>
                                                    <td>{formatDOB(row.dob)}</td>
                                                    <td>{row.userAddress}</td>
                                                    <td>
                                                        <span className="badge bg-primary rounded">{row.userReferralCode}</span>
                                                    </td>
                                                    <td>{row.authUserInfo?.authUserName ?? '--'}</td>
                                                    <td>{formatDateTime(row.userCreatedAt)}</td>
                                                    <td>{getActiveStatus(row.userActive)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success rounded-pill me-1"
                                                            onClick={() => handleView(row.userId)}
                                                        >
                                                            👁️
                                                        </button>
                                                        <button className="btn btn-sm btn-info rounded-pill me-1"
                                                            onClick={() => handleEdit(row)}>
                                                            ✏️
                                                        </button>
                                                        <button className="btn btn-sm btn-danger rounded-pill"
                                                            onClick={() => {
                                                                setUserId(row.userId);
                                                                setUserName(row.fullName);
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
                                            <img src={userImage ? `${import.meta.env.VITE_8081_API_BASE}/uploads/${userImage}` : profileImg} alt="Profile" className="rounded-circle border" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Full Name</div>
                                            <div className="col-lg-9 col-md-8">{fullName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Phone Number</div>
                                            <div className="col-lg-9 col-md-8">{phoneNumber}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Email Address</div>
                                            <div className="col-lg-9 col-md-8">{emailAddress}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Date of Birth</div>
                                            <div className="col-lg-9 col-md-8">{formatDOB(dob)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Address</div>
                                            <div className="col-lg-9 col-md-8">{userAddress}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Referral Code</div>
                                            <div className="col-lg-9 col-md-8">
                                                <span className="badge bg-primary rounded">{userReferralCode}</span>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Active</div>
                                            <div className="col-lg-9 col-md-8">{getActiveStatus(userActive)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(userCreatedAt)}</div>
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
                <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ maxHeight: "65vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="row g-3 p-3">
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={fullName} onChange={(e) => setUserName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Email *</label>
                                        <input type="email" className="form-control" maxLength="50" value={emailAddress} onChange={(e) => setUserEmail(e.target.value)} autoComplete="new-email" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Phone Number *</label>
                                        <input type="text" className="form-control" minLength="10" maxLength="10" value={phoneNumber} onChange={(e) => setUserPhone(e.target.value)} autoComplete="new-phone-number" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Date of Birth *</label>
                                        <input type="date" className="form-control" value={dob} onChange={(e) => setUserDob(e.target.value)} required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Address *</label>
                                        <input type="text" className="form-control" maxLength="50" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} autoComplete="new-address" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={userActive} onChange={(e) => setUserActive(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="YES">Yes</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setUserImage(e.target.files[0])}
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
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this "{fullName}" User?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(userId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserView;
