import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { DataTable } from "simple-datatables";
import { addCategoryApi, deleteCategoryApi, getCategoriesListApi, updateCategoryApi } from "../../api/categories-api";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { formatDateTime, getActiveStatus } from "./FunctionHelper";
import { toast } from "react-toastify";
import profileImg from '../../assets/img/profile-img.jpg';

const ProductCategoryView = () => {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add Category");
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [categoryActive, setCategoryActive] = useState("YES");
    const [categoryImage, setCategoryImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Categories | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAllCategories();
    }, []);

    // FETCH ALL CATEGORIES
    const fetchAllCategories = async () => {
        try {
            setLoading(true);
            const res = await getCategoriesListApi();
            setCategoriesList(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }

        if (!dataTableRef.current && categoriesList.length > 0) {
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
    }, [categoriesList]);

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!categoryName.trim()) {
            toast.error("Category name is required.");
            setLoading(false);
            return;
        }
        if (!categoryActive.trim()) {
            toast.error("Please select active status.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("categoryActive", categoryActive);
        if (categoryImage) formData.append("categoryImage", categoryImage);

        try {
            if (isAddModal) {
                const addRes = await addCategoryApi(formData);
                if (addRes.data.status === 'exist') {
                    toast.warn("Category already exists!");
                    return;
                }
                toast.success("Category added successfully!");
            } else {
                const updateRes = await updateCategoryApi(categoryId, formData);
                if (updateRes.data.status === 'exist') {
                    toast.warn("Category already exists!");
                    return;
                }
                toast.success("Category updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                fetchAllCategories();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save category.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setCategoryId(null);
        setCategoryName("");
        setCategoryActive("YES");
        setCategoryImage(null);
        setIsAddModal(true);
        setModalTitle("Add Category");
    };

    // EDIT CATEGORY
    const handleEdit = (id) => {
        const category = categoriesList.find(l => l.categoryId == id);
        if (!category) return;

        setIsAddModal(false);
        setModalTitle("Update Category");
        setCategoryId(category.categoryId);
        setCategoryName(category.categoryName);
        setCategoryActive(category.categoryActive);
        setCategoryImage(category.categoryImage);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE CATEGORY
    const handleDelete = async (id) => {
        try {
            await deleteCategoryApi(id);
            toast.success("Category deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                fetchAllCategories();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete category.");
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
                                                <th>Category Name</th>
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
                                                    <strong className="ms-2">Loading categorie(s)...</strong>
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
                                                <th>Category Name</th>
                                                <th>Action By</th>
                                                <th>Created At</th>
                                                <th>Active</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {categoriesList.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        No categorie(s) found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                categoriesList.map((row, index) => (
                                                    <tr key={`${row.categoryId}-${row.categoryCreatedAt}`}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={row.categoryImage ? `${import.meta.env.VITE_8084_API_BASE}/uploads/${row.categoryImage}` : profileImg} style={{ maxHeight: "70px", maxWidth: "80px" }} alt="categoryImage" />
                                                        </td>
                                                        <td>{row.categoryName}</td>
                                                        <td>{row.authUserInfo?.authUserName ?? '-'}</td>
                                                        <td>{formatDateTime(row.categoryCreatedAt)}</td>
                                                        <td>{getActiveStatus(row.categoryActive)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info rounded-pill me-1"
                                                                data-id={row.categoryId}
                                                                onClick={(e) => handleEdit(e.currentTarget.dataset.id)}>
                                                                ✏️
                                                            </button>
                                                            <button className="btn btn-sm btn-danger rounded-pill"
                                                                data-id={row.categoryId}
                                                                data-name={row.categoryName}
                                                                data-image={row.categoryImage}
                                                                onClick={(e) => {
                                                                    setCategoryId(e.currentTarget.dataset.id);
                                                                    setCategoryName(e.currentTarget.dataset.name);
                                                                    setCategoryImage(e.currentTarget.dataset.image);
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
                                        <label className="form-label">Category Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={categoryActive} onChange={(e) => setCategoryActive(e.target.value)} required>
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
                                            onChange={(e) => setCategoryImage(e.target.files[0])}
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
                            <p>Are you sure you want to delete this "{categoryName}" Category?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(categoryId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductCategoryView;
