import React, { useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

const ProductView = () => {

    useEffect(() => {
        document.title = "Manage Products | Admin Panel";
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">Manage Products</h1>
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
                                                    <th>Code</th>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>Subcategory</th>
                                                    <th>Language</th>
                                                    <th>Brand</th>
                                                    <th>Availability</th>
                                                    <th>Price</th>
                                                    <th>Details</th>
                                                    <th>Image</th>
                                                    <th>Stock</th>
                                                    <th>Action By</th>
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                    <th>Active</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tcategory">
                                                <tr id="loader-row">
                                                    <td colSpan="17" className="text-center py-4">
                                                        <div className="spinner-border spinner-border-sm"></div>
                                                        <strong>Product(s) Loading...</strong>
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
                            <h5 className="modal-title" id="addModalTitle">Add Product</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Name *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addProductName" maxLength="100" autoComplete="new-name" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Category *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProductCategory" required>
                                                <option value="">-- Select --</option>
                                                <option value="One">One</option>
                                                <option value="Two">Two</option>
                                                <option value="Three">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Subcategory *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProductSubCategory" required>
                                                <option value="">-- Select --</option>
                                                <option value="One">One</option>
                                                <option value="Two">Two</option>
                                                <option value="Three">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Language *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProductLanguage" required>
                                                <option value="">-- Select --</option>
                                                <option value="One">One</option>
                                                <option value="Two">Two</option>
                                                <option value="Three">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Brand *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addProductBrand" maxLength={50} autoComplete="new-brand" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">code *</label>
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" name="addProductCode" maxLength="50" autoComplete="new-code" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Availability *</label>
                                        <div className="col-sm-12">
                                            <input type="number" className="form-control" name="addProductAvailability" autoComplete="new-availability" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Price *</label>
                                        <div className="col-sm-12">
                                            <input type="number" className="form-control" name="addProductPrice" autoComplete="new-price" required />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Details *</label>
                                        <div className="col-sm-12">
                                            <textarea type="text" className="form-control" name="addProductDetails" autoComplete="new-details" rows="3" required></textarea>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Stock *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProductStock" required>
                                                <option value="">-- Select --</option>
                                                <option value="IN_STOCK">In Stock</option>
                                                <option value="OUT_OF_STOCK">Out of Stock</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">Active *</label>
                                        <div className="col-sm-12">
                                            <select className="form-select" name="addProductActive" required>
                                                <option value="">-- Select --</option>
                                                <option value="YES">Yes</option>
                                                <option value="NO">No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">
                                        <span id="addProductSpinner" className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ display: "none" }}></span>
                                        <span className="saveProduct" id="saveProductText">Save</span>
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
                            <p>Are you sure you want to delete this Product?</p>
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

export default ProductView;
