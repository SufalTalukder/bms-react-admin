import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { addLanguageApi, deleteLanguageApi, getAllLanguagesApi, updateLanguageApi } from "../../api/languages-api";
import { DataTable } from "simple-datatables";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { formatDateTime, getActiveStatus } from "./FunctionHelper";
import { toast } from "react-toastify";

const LanguageView = () => {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add Language");
    const [languageId, setLanguageId] = useState(null);
    const [languageName, setLanguageName] = useState("");
    const [languageActive, setLanguageActive] = useState("YES");
    const [loading, setLoading] = useState(false);
    const [languagesList, setLanguagesList] = useState([]);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Languages | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAllLanguages();
    }, []);

    // FETCH ALL LANGUAGES
    const fetchAllLanguages = async () => {
        try {
            setLoading(true);
            const res = await getAllLanguagesApi();
            setLanguagesList(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch languages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }

        if (!dataTableRef.current && languagesList.length > 0) {
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
    }, [languagesList]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!languageName) {
            toast.error("Language name is required.");
            setLoading(false);
            return;
        }
        if (!languageActive) {
            toast.error("Please select active status.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("languageName", languageName);
        formData.append("languageActive", languageActive);

        try {
            if (isAddModal) {
                await addLanguageApi(formData);
                toast.success("Language added successfully!");
            } else {
                await updateLanguageApi(languageId, formData);
                toast.success("Language updated successfully!");
            }
            resetForm();
            await fetchAllLanguages();
            window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save language.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setLanguageId(null);
        setLanguageName("");
        setLanguageActive("YES");
        setIsAddModal(true);
        setModalTitle("Add Language");
    };

    // EDIT USER
    const handleEdit = (language) => {
        setIsAddModal(false);
        setModalTitle("Update Language");
        setLanguageId(language.languageId);
        setLanguageName(language.languageName);
        setLanguageActive(language.languageActive);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE USER
    const handleDelete = async (id) => {
        console.log(id);
        
        try {
            await deleteLanguageApi(id);
            toast.success("Language deleted successfully!");
            await fetchAllLanguages();
            window.bootstrap.Modal
                .getInstance(document.getElementById("deleteModal"))
                ?.hide();
        } catch (error) {
            toast.error("Failed to delete language.");
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Languages</h1>
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

                    {loading && (
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
                                                <th>Language Name</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Loading language(s)...</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && (
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
                                                <th>Language Name</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {languagesList.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No language(s) found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                languagesList.map((row, index) => (
                                                    <tr key={`${row.languageId}-${row.languageCreatedAt}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.languageName}</td>
                                                        <td>{row.authUserInfo?.authUserName ?? '-'}</td>
                                                        <td>{formatDateTime(row.languageCreatedAt)}</td>
                                                        <td>{getActiveStatus(row.languageActive)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info rounded-pill me-1"
                                                                onClick={() => handleEdit(row)}>
                                                                ✏️
                                                            </button>
                                                            <button className="btn btn-sm btn-danger rounded-pill"
                                                                onClick={() => {
                                                                    setLanguageId(row.languageId);
                                                                    setLanguageName(row.languageName);
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
                    )}
                </main>
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
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Language Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={languageName} onChange={(e) => setLanguageName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={languageActive} onChange={(e) => setLanguageActive(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="YES">Yes</option>
                                            <option value="NO">No</option>
                                        </select>
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
                            <p>Are you sure you want to delete this "{languageName}" User?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(languageId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LanguageView;
