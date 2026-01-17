import React, { useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

const BannerView = () => {

    useEffect(() => {
        document.title = "Manage Banners | Admin Panel";
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">Manage Banners</h1>
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
                                                    <th>Image</th>
                                                    <th>Action By</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tcategory">
                                                <tr id="loader-row">
                                                    <td colSpan="5" className="text-center py-4">
                                                        <div className="spinner-border spinner-border-sm"></div>
                                                        <strong className="ms-2">Banner(s) Loading...</strong>
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
                            <h5 className="modal-title">Add / Update Banner</h5>
                            <button type="button" className="btn-close red-bold" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <label className="col-sm-12 col-form-label">
                                            Upload Image(s)
                                        </label>
                                        <div className="col-sm-12">
                                            <input type="file" className="form-control" name="appBannerImage" accept=".png,.jpg,.jpeg" multiple />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="btnClick">
                                <span id="addBannerSpinner" className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ display: "none", pointerEvents: "none" }} />
                                <span id="saveBannerText">Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true" data-bs-backdrop="static" data-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure! you want to delete this Banner?</p>
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

export default BannerView;
