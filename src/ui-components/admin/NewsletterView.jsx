import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { NEWSLETTER_PAGE_TITLE } from "../../lang-dump/lang";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { toast } from "react-toastify";
import { DataTable } from "simple-datatables";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { getUsersListApi } from "../../api/users-api";
import { addNewsletterApi, getNewslettersListApi, updateNewsletterApi } from "../../api/newsletter-api";

export default function NewsletterView() {

    const [modalTitle, setModalTitle] = useState("Add Newsletter");
    const [newsletterId, setNewsletterId] = useState(null);
    const [userId, setUserId] = useState("");
    const [newsletterToggle, setNewsletterToggle] = useState("NO");

    const [newslettersList, setNewslettersList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = NEWSLETTER_PAGE_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchUsers();
        loadNewsletters();
    }, []);

    // FETCH ALL PERMISSIONS
    const loadNewsletters = async () => {
        try {
            setLoading(true);
            const res = await getNewslettersListApi();
            setNewslettersList(res.data?.content || []);
        } catch (e) {
            toast.error("Failed to load records!");
        } finally {
            setLoading(false);
        }
    };

    // FETCH ALL USERS
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getUsersListApi();
            setUsersList(res.data?.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && newslettersList.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,
                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],
                columns: [{ select: 0, sort: "asc" }]
            });
        }
    }, [newslettersList]);

    // HANDLE SUBMIT FOR ADD
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.error("Please select a user.");
            setLoading(false);
            return;
        }
        if (!newsletterToggle) {
            toast.error("Please select a toggle status.");
            setLoading(false);
            return;
        }
        const payload = {
            userId: userId,
            newsletterToggle: newsletterToggle
        };

        try {
            setLoading(true);
            await addNewsletterApi(payload);
            toast.success("Record added successfully!");
            setTimeout(() => {
                resetForm();
                loadNewsletters();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save record.");
        } finally {
            setLoading(false);
        }
    };

    // HANDLE TOGGLE CHANGE
    const handleToggleChange = async (newsletterId, userId, newValue, isChecked) => {

        const payload = {
            userId: userId,
            newsletterToggle: newValue
        };

        try {
            await updateNewsletterApi(newsletterId, payload);
            toast.success(`Newsletter ${isChecked ? "subscribed" : "unsubscribed"} successfully!`);
            loadNewsletters();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update record.");
        }
    }

    // RESET FORM
    const resetForm = () => {
        setNewsletterId(null);
        setUserId("");
        setNewsletterToggle("NO");
        setModalTitle("Add Newsletter");
    };

    const refreshTable = () => {
        setLoading(true);
        loadNewsletters();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <div className="text-left">
                            <h1 className="toggle-heading">Manage Newsletters</h1>
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
                                            <th>Subscriber</th>
                                            <th>Is Subscribed</th>
                                            <th>Action By</th>
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
                                        ) : newslettersList.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    No record(s) found!
                                                </td>
                                            </tr>
                                        ) : (
                                            newslettersList.map((row, index) => (
                                                <tr key={`${row.newsletterId}-${row.newsletterCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{row?.userInfo?.fullName}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={row.newsletterToggle === "YES"}
                                                                onChange={(e) =>
                                                                    handleToggleChange(
                                                                        row.newsletterId,
                                                                        row?.userInfo?.userId,
                                                                        row.newsletterToggle === "YES" ? "NO" : "YES",
                                                                        e.target.checked
                                                                    )
                                                                }
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>{row?.authUserInfo?.actionByUserInfo?.authUserName}</td>
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
            <div className="modal fade" id="addUpdateModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: "65vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Newsletter</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <label className="col-sm-12 col-form-label">User *</label>
                                            <div className="col-sm-12">
                                                <select className="form-select" name="addUser" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                                                    <option value="">-- Select --</option>
                                                    {usersList.map((row) => (
                                                        <option key={`${row.userId}-${row.userCreatedAt}`} value={row.userId}>{row.fullName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-sm-12 col-form-label">Subscribe *</label>
                                            <div className="col-sm-12">
                                                <select className="form-select" name="addSubscribe" value={newsletterToggle} onChange={(e) => setNewsletterToggle(e.target.value)} required>
                                                    <option value="">-- Select --</option>
                                                    <option value="YES">Yes</option>
                                                    <option value="NO">No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <ReusableModalButtons
                                        loading={loading}
                                        mode="add"
                                        onCancel={resetForm}
                                        submitText="Save"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
