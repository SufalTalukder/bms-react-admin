import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { DataTable } from "simple-datatables";
import { addSubCategoryApi, deleteSubCategoryApi, getSubCategoriesListApi, updateSubCategoryApi } from "../../api/sub-categories-api";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { formatDateTime, getActiveStatus } from "./FunctionHelper";
import { toast } from "react-toastify";
import profileImg from '../../assets/img/profile-img.jpg';

export default function ProductSubCategoryView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add SubCategory");
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState("");
    const [subCategoryActive, setSubCategoryActive] = useState("YES");
    const [subCategoryImage, setSubCategoryImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subCategoriesList, setSubCategoriesList] = useState([]);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage SubCategories | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAllSubCategories();
    }, []);

    // FETCH ALL SUB CATEGORIES
    const fetchAllSubCategories = async () => {
        try {
            setLoading(true);
            const res = await getSubCategoriesListApi();
            setSubCategoriesList(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch subcategories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }

        if (!dataTableRef.current && subCategoriesList.length > 0) {
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
    }, [subCategoriesList]);

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!subCategoryName.trim()) {
            toast.error("SubCategory name is required.");
            setLoading(false);
            return;
        }
        if (!subCategoryActive.trim()) {
            toast.error("Please select active status.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("subCategoryName", subCategoryName);
        formData.append("subCategoryActive", subCategoryActive);
        if (subCategoryImage) formData.append("subCategoryImage", subCategoryImage);

        try {
            if (isAddModal) {
                const addRes = await addSubCategoryApi(formData);
                if (addRes.data.status === 'exist') {
                    toast.warn("SubCategory already exists!");
                    return;
                }
                toast.success("SubCategory added successfully!");
            } else {
                const updateRes = await updateSubCategoryApi(subCategoryId, formData);
                if (updateRes.data.status === 'exist') {
                    toast.warn("SubCategory already exists!");
                    return;
                }
                toast.success("SubCategory updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                fetchAllSubCategories();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save subcategory.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setSubCategoryId(null);
        setSubCategoryName("");
        setSubCategoryActive("YES");
        setSubCategoryImage(null);
        setIsAddModal(true);
        setModalTitle("Add SubCategory");
    };

    // EDIT SUB CATEGORY
    const handleEdit = (id) => {
        const category = subCategoriesList.find(l => l.subCategoryId == id);
        if (!category) return;

        setIsAddModal(false);
        setModalTitle("Update SubCategory");
        setSubCategoryId(category.subCategoryId);
        setSubCategoryName(category.subCategoryName);
        setSubCategoryActive(category.subCategoryActive);
        setSubCategoryImage(category.subCategoryImage);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE SUB CATEGORY
    const handleDelete = async (id) => {
        try {
            await deleteSubCategoryApi(id);
            toast.success("SubCategory deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                fetchAllSubCategories();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete subcategory.");
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Categories</h1>
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
                                                <th>Image</th>
                                                <th>SubCategory Name</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Loading subcategorie(s)...</strong>
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
                                                <th>Image</th>
                                                <th>SubCategory Name</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {subCategoriesList.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        No subcategorie(s) found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                subCategoriesList.map((row, index) => (
                                                    <tr key={`${row.subCategoryId}-${row.subCategoryCreatedAt}`}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={row.subCategoryImage ? `${import.meta.env.VITE_8085_API_BASE}/uploads/${row.subCategoryImage}` : profileImg} style={{ maxHeight: "70px", maxWidth: "80px" }} alt="subCategoryImage" />
                                                        </td>
                                                        <td>{row.subCategoryName}</td>
                                                        <td>{row.authUserInfo?.authUserName ?? '-'}</td>
                                                        <td>{formatDateTime(row.subCategoryCreatedAt)}</td>
                                                        <td>{getActiveStatus(row.subCategoryActive)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info rounded-pill me-1"
                                                                data-id={row.subCategoryId}
                                                                onClick={(e) => handleEdit(e.currentTarget.dataset.id)}>
                                                                ✏️
                                                            </button>
                                                            <button className="btn btn-sm btn-danger rounded-pill"
                                                                data-id={row.subCategoryId}
                                                                data-name={row.subCategoryName}
                                                                data-image={row.subCategoryImage}
                                                                onClick={(e) => {
                                                                    setSubCategoryId(e.currentTarget.dataset.id);
                                                                    setSubCategoryName(e.currentTarget.dataset.name);
                                                                    setSubCategoryImage(e.currentTarget.dataset.image);
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
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Sub Category Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={subCategoryActive} onChange={(e) => setSubCategoryActive(e.target.value)} required>
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
                                            onChange={(e) => setSubCategoryImage(e.target.files[0])}
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
                            <p>Are you sure you want to delete this `{subCategoryName}` SubCategory?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(subCategoryId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
