import React, { useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

const ProductSubCategoryView = () => {

    useEffect(() => {
        document.title = "Manage Subcategories | Admin Panel";
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">Manage Subcategories</h1>
                        <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addUpdateModal">
                            + Add Record
                        </button>
                    </div>
                    <section className="section">
                        <div className="row">
                            <div className="col-lg-12 px-0">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="datatable-top d-flex gap-2 pt-3">
                                            <button className="btn btn-sm btn-outline-primary" id="export-csv">Export CSV</button>
                                            <button className="btn btn-sm btn-outline-success" id="export-excel">ExportExcel</button>
                                            <button className="btn btn-sm btn-outline-danger" id="export-pdf">Export PDF</button>
                                            <button className="btn btn-sm btn-outline-info" id="export-doc">Export DOC</button>
                                            <button className="btn btn-sm btn-outline-warning" id="export-txt">Export TXT</button>
                                            <button className="btn btn-sm btn-outline-dark" id="export-sql">Export SQL</button>
                                        </div>
                                        <table className="table table-hover table-sm mt-2" id="demo-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Name</th>
                                                    <th>Action By</th>
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                    <th>Active</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tcategory">
                                                <tr id="loader-row">
                                                    <td colSpan="7" className="text-center py-4">
                                                        <div className="spinner-border spinner-border-sm"></div>
                                                        <strong>&nbsp; Subcategorie(s) Loading...</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* ADD MODAL */}
            {/* OR, UPDATE MODAL */}
            <div className="modal fade" id="addUpdateModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: "65vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addModalTitle">Add Subcategory</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row mb-3 pt-2">
                                        <label className="col-sm-12 col-form-label">Name *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addSubCategoryName" maxLength="100" autoComplete="new-name" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Active *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addSubCategoryActive" required>
                                                <option value="">-- Select --</option>
                                                <option value="YES">Yes</option>
                                                <option value="NO">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" style={{ display: "none" }} >
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
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
                            <p>Are you sure you want to delete this Subcategory?</p>
                            <input type="hidden" name="" value="" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" id="confirmDelete">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductSubCategoryView;
