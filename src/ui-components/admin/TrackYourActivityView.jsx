import React, { useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";

const TrackYourActivityView = () => {

    useEffect(() => {
        document.title = "Track Your Activity | Admin Panel";
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="mb-0">Track Your Activity</h1>
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
                                                    <th>Method</th>
                                                    <th>Message</th>
                                                    <th>Created At</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tcategory">
                                                <tr id="loader-row">
                                                    <td colSpan="5" className="text-center py-4">
                                                        <div className="spinner-border spinner-border-sm"></div>
                                                        <strong className="ms-2">Activity Log(s) Loading...</strong>
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
        </DashboardLayout>
    );
};

export default TrackYourActivityView;
