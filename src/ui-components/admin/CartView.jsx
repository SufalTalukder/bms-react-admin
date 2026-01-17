import React, { useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

const CartView = () => {

    useEffect(() => {
        document.title = "Manage Carts | Admin Panel";
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">Manage Carts</h1>
                        <div className="d-flex align-items-center gap-2">
                            <select className="form-select" name="filterByUserId" style={{ maxWidth: "140px" }}>
                                <option value="">-- Filter User --</option>
                                <option value="User">User</option>
                            </select>
                            <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addUpdateModal">
                                + Add Record
                            </button>
                        </div>
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
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>User</th>
                                                    <th>Action By</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tcategory">
                                                <tr id="loader-row">
                                                    <td colSpan="8" className="text-center py-4">
                                                        <div className="spinner-border spinner-border-sm"></div>
                                                        <strong>&nbsp; Cart(s) Loading...</strong>
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
                            <h5 className="modal-title">Add Wishlist</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <input type="hidden" name="<?= csrf_token() ?>" value="<?= csrf_hash() ?>" />
                                    <div className="row mb-3 pt-2">
                                        <label className="col-sm-12 col-form-label">User *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addUser" required>
                                                <option value="">-- Select --</option>
                                                <option value="User">User</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Product *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProduct" required>
                                                <option value="">-- Select --</option>
                                                <option value="Product">Product</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Quantity *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addQuantity" autoComplete="none" maxLength="8" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Price *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addPrice" autoComplete="new-price" maxLength="10" readOnly required />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ display: "none", pointerEvents: "none" }}></span>
                                        <span className="saveCart">Save</span>
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
                            <p>Are you sure you want to delete this Cart?</p>
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

export default CartView;
