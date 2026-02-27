import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import { formatDateTime } from "./FunctionHelper";
import { toast } from "react-toastify";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";;
import { useTranslation } from "react-i18next";
import { getAllCheckoutHistoriesApi } from "../../api/checkout-api";

export default function CheckoutView() {

    const { t } = useTranslation();

    // STATE VARIBALES
    const [checkoutLists, setCheckoutLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBtnText, setModalBtnText] = useState("");
    const [authUserImage, setAuthUserImage] = useState(null);
    const [actionBy, setActionBy] = useState("");
    const [userId, setUserId] = useState("");
    const [cartDetails, setCartDetails] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [paymentAddress, setPaymentAddress] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [deliveryInDays, setDeliveryInDays] = useState(3);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentDateTime, setPaymentDateTime] = useState("");
    const [checkOutHistoryCreatedAt, setCheckOutHistoryCreatedAt] = useState("");

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Checkouts - BMS Book Store";
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadUserCheckouts();
    }, [t]);

    const loadUserCheckouts = async () => {
        try {
            setLoading(true);
            const res = await getAllCheckoutHistoriesApi();
            setCheckoutLists(res.data.content || []);
        } catch (e) {
            console.error(e);
            toast.error(t('common.failed_to_fetch_records'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
    
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
    
        if (checkoutLists.length > 0 && tableRef.current) {
            dataTableRef.current = new DataTable(tableRef.current, {
                searchable: true,
                sortable: true,
                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],
                columns: [{ select: 0, sort: "asc" }]
            });
        }
    }, [checkoutLists, loading]);

    // VIEW CHECKOUT DETAILS
    const handleView = () => { };

    const refreshSystemLogs = () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        setLoading(true);
        loadUserCheckouts();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">{t('track_system_activites.header_title')}</h1>
                        <button className="btn btn-secondary" onClick={() => refreshSystemLogs()} disabled={loading}>
                            <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                            {t('common.refresh')}
                        </button>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">
                            <ReusableExportTable
                                tableRef={tableRef}
                                dataTableRef={dataTableRef}
                            />

                            {loading && (
                                <div className="table-responsive system-log-table">
                                    <table
                                        ref={tableRef}
                                        className="table table-hover table-sm mb-0"
                                    >
                                        <thead className="table-light">
                                            <tr>
                                                <th>{t('common.sr_no')}</th>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Products</th>
                                                <th>Payment</th>
                                                <th>Shipping</th>
                                                <th>Amount</th>
                                                <th>Payment Status</th>
                                                <th>Order Status</th>
                                                <th>Payment Time</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td colSpan="12" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">{t('common.loading')}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {!loading && (
                                <div className="table-responsive system-log-table">
                                    <table
                                        ref={tableRef}
                                        className="table table-hover table-bordered table-sm mb-0"
                                    >
                                        <thead className="table-light">
                                            <tr>
                                                <th>{t('common.sr_no')}</th>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Products</th>
                                                <th>Payment</th>
                                                <th>Shipping</th>
                                                <th>Amount</th>
                                                <th>Payment Status</th>
                                                <th>Order Status</th>
                                                <th>Payment Time</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody key={checkoutLists.length}>
                                            {checkoutLists.length === 0 ? (
                                                <tr>
                                                    <td colSpan="12" className="text-center py-4">
                                                        No records found
                                                    </td>
                                                </tr>
                                            ) : (
                                                checkoutLists.map((row, index) => (
                                                    <tr key={row.checkOutHistoryId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <strong>#{row.checkOutHistoryId}</strong>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{row.userInfo?.fullName}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    {row.userInfo?.emailAddress}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td style={{ maxWidth: "250px" }}>
                                                            {row.products?.map((product) => (
                                                                <div key={product.productId} className="mb-1">
                                                                    <small>
                                                                        {product.productName}
                                                                        <br />
                                                                        <span className="text-muted">
                                                                            ${product.productPrice}
                                                                        </span>
                                                                    </small>
                                                                </div>
                                                            ))}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{row.paymentMethod}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    {row.paymentAddress}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{row.shippingMethod}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    {row.shippingAddress}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <strong>${row.paymentAmount?.toFixed(2)}</strong>
                                                            <br />
                                                            <small className="text-muted">
                                                                {row.deliveryInDays} days
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${row.paymentStatus === "PAID"
                                                                    ? "bg-success"
                                                                    : "bg-warning"
                                                                    }`}
                                                            >
                                                                {row.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info">
                                                                {row.orderStatus}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {row.paymentDateTime
                                                                ? formatDateTime(row.paymentDateTime)
                                                                : "N/A"}
                                                        </td>
                                                        <td>
                                                            {formatDateTime(row.checkOutHistoryCreatedAt)}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-success rounded-pill me-1 view-btn"
                                                                onClick={() => handleView(row.checkOutHistoryId)}
                                                            >
                                                                👁️
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* VIEW MODAL */}
        </DashboardLayout>
    );
}