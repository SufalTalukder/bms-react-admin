import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { deleteMultipleBannersApi, getBannersListApi, uploadMultipleBannersApi } from "../../api/banners-api";
import { DataTable } from "simple-datatables";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { formatDateTime, getActiveStatus } from "./FunctionHelper";
import { toast } from "react-toastify";
import {
    BANNER_DELETED_SUCCESSFULLY, BANNER_FAILED_TO_DELETE, BANNER_FAILED_TO_FETCH_BANNERS, BANNER_FAILED_TO_UPLOAD, BANNER_HEADING_MANAGE_BANNERS, BANNER_LOADING, BANNER_MODAL_SELECT_ACTIVE_STATUS, BANNER_MODAL_SELECT_BANNER_IMAGES, BANNER_NOT_FOUND, BANNER_TITLE, BANNER_UPLOAD, BANNER_UPLOADING_SUCCESSFULLY, CONFIRM_DELETION
} from "../../lang-dump/lang";

const BannerView = () => {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Upload Banner");
    const [appBannerId, setAppBannerId] = useState(null);
    const [appBannerName, setAppBannerName] = useState("");
    const [appBannerImages, setAppBannerImages] = useState([]);
    const [bannerActiveStatus, setBannerActiveStatus] = useState("YES");
    const [allBanners, setAllBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = BANNER_TITLE;
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAllBanners();
    }, []);

    // FETCH ALL BANNERS
    const fetchAllBanners = async () => {
        try {
            setLoading(true);
            const res = await getBannersListApi();
            setAllBanners(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error(BANNER_FAILED_TO_FETCH_BANNERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && allBanners.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,
                perPage: 10
            });
        }
    }, [allBanners.length]);

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (appBannerImages.length === 0) {
            toast.error(BANNER_MODAL_SELECT_BANNER_IMAGES);
            setLoading(false);
            return;
        }
        if (!bannerActiveStatus) {
            toast.error(BANNER_MODAL_SELECT_ACTIVE_STATUS);
            setLoading(false);
            return;
        }

        const formData = new FormData();

        appBannerImages.forEach((file) => {
            formData.append("appBannerImages", file);
        });

        formData.append("bannerActive", bannerActiveStatus);

        try {
            await uploadMultipleBannersApi(formData);
            toast.success(BANNER_UPLOADING_SUCCESSFULLY);

            setTimeout(() => {
                resetForm();
                fetchAllBanners();
                window.bootstrap.Modal
                    .getInstance(document.getElementById("addUpdateModal"))
                    ?.hide();
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error(BANNER_FAILED_TO_UPLOAD);
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setAppBannerId(null);
        setAppBannerImages([]);
        setBannerActiveStatus("YES");
        setModalTitle(BANNER_UPLOAD);
    };

    // DELETE BANNER
    const handleDelete = async (id) => {
        try {
            await deleteMultipleBannersApi([id]);
            toast.success(BANNER_DELETED_SUCCESSFULLY);

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                fetchAllBanners();
            }, 1000);
        } catch (error) {
            toast.error(BANNER_FAILED_TO_DELETE);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">{BANNER_HEADING_MANAGE_BANNERS}</h1>
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
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={allBanners.length}>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">{BANNER_LOADING}</strong>
                                                </td>
                                            </tr>
                                        ) : allBanners.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    {BANNER_NOT_FOUND}
                                                </td>
                                            </tr>
                                        ) : (
                                            allBanners.map((row, index) => (
                                                <tr key={`${row.appBannerId}-${row.appBannerCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <img
                                                            src={`${import.meta.env.VITE_8083_API_BASE}/uploads/${row.appBannerImage}`}
                                                            style={{ maxHeight: "70px", maxWidth: "80px" }}
                                                            alt="banner"
                                                        />
                                                    </td>
                                                    <td>{row.authUserInfo?.authUserName}</td>
                                                    <td>{formatDateTime(row.appBannerCreatedAt)}</td>
                                                    <td>{getActiveStatus(row.bannerActive)}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-danger rounded-pill"
                                                            onClick={() => {
                                                                setAppBannerId(row.appBannerId);
                                                                setAppBannerName(row.appBannerImage);
                                                                new window.bootstrap.Modal(
                                                                    document.getElementById("deleteModal")
                                                                ).show();
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
                                        <label className="form-label">Upload Image(s)</label>
                                        <input
                                            type="file"
                                            multiple
                                            className="form-control"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e) => setAppBannerImages(Array.from(e.target.files))}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={bannerActiveStatus} onChange={(e) => setBannerActiveStatus(e.target.value)} required>
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
                            <h5 className="modal-title" id="deleteModalLabel">{CONFIRM_DELETION}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Are you sure you want to delete this "{appBannerName}" banner?
                            </p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(appBannerId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BannerView;
