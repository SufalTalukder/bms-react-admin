import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import { formatDateTime, formatPhoneNumber, getActiveStatus, getOrderStatus, getPaymentMethod, getPaymentStatus, getShippingMethod, getStockStatus } from "./FunctionHelper";
import { toast } from "react-toastify";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { useTranslation } from "react-i18next";
import { getAllCheckoutHistoriesApi, getCheckoutDetailsApi } from "../../api/checkout-api";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";

export default function CheckoutView() {

    const { t } = useTranslation();

    // STATE VARIBALES
    const [checkoutLists, setCheckoutLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBtnText, setModalBtnText] = useState("");
    const [actionBy, setActionBy] = useState("");

    // FOR PAYMENT DETAILS
    const [paymentAddress, setPaymentAddress] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [deliveryInDays, setDeliveryInDays] = useState(3);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentDateTime, setPaymentDateTime] = useState("");

    // FOR USER
    const [userName, setUserName] = useState("");
    const [emailAddress, setUserEmail] = useState("");
    const [phoneNumber, setUserPhone] = useState("");
    const [userActive, setUserActive] = useState("YES");
    const [userCreatedAt, setUserCreatedAt] = useState("");

    // FOR PRODUCT
    const [productDetails, setProductDetails] = useState([]);

    const [openSection, setOpenSection] = useState(null);
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

    // TOGGLE COLLAPSE SECTIONS IN VIEW MODAL
    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
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
    const handleView = async (id) => {
        try {
            const res = await getCheckoutDetailsApi(id);
            const checkoutDetails = res.data?.content;
            if (checkoutDetails) {
                setModalTitle(t('common.view_details'));
                setModalBtnText(t('common.ok_button'));

                // USER INFO
                setUserName(checkoutDetails.userInfo?.fullName);
                setUserEmail(checkoutDetails.userInfo?.emailAddress);
                setUserPhone(checkoutDetails.userInfo?.phoneNumber);
                setUserActive(checkoutDetails.userInfo?.userActive);
                setUserCreatedAt(checkoutDetails.userInfo?.userCreatedAt);

                // PRODUCT INFO
                setProductDetails(checkoutDetails?.products);

                setActionBy(checkoutDetails.authUserInfo?.authUserName || "-");
                setPaymentAddress(checkoutDetails.paymentAddress || "-");
                setShippingAddress(checkoutDetails.browserVersion || "-");
                setShippingMethod(checkoutDetails.shippingMethod || "-");
                setPaymentMethod(checkoutDetails.paymentMethod || "-");
                setPaymentAmount(checkoutDetails.paymentAmount || "-");
                setDeliveryInDays(checkoutDetails.deliveryInDays || "-");
                setPaymentStatus(checkoutDetails.paymentStatus || false);
                setOrderStatus(checkoutDetails.orderStatus || "-");
                setPaymentDateTime(checkoutDetails.paymentDateTime || "-");
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error(t('common.no_records_found'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('common.failed_to_fetch_detail'));
        } finally {
            setLoading(false);
        }
    };

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
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td colSpan="11" className="text-center py-4">
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
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody key={checkoutLists.length}>
                                            {checkoutLists.length === 0 ? (
                                                <tr>
                                                    <td colSpan="11" className="text-center py-4">
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
                                                                <strong>{getPaymentMethod(row.paymentMethod)}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    {row.paymentAddress}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{getShippingMethod(row.shippingMethod)}</strong>
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
                                                            {getPaymentStatus(row.paymentStatus)}
                                                        </td>
                                                        <td>
                                                            {getOrderStatus(row.orderStatus)}
                                                        </td>
                                                        <td>
                                                            {row.paymentDateTime
                                                                ? formatDateTime(row.paymentDateTime)
                                                                : "N/A"}
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
            <div className="modal fade" id="viewModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-scrollable" style={{ maxHeight: "65vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                            <div className="row g-3 p-3">
                                {/* USER DETAILS TOGGLE */}
                                <div
                                    className="d-flex justify-content-between align-items-center fw-bold"
                                    onClick={() => handleToggle("user")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span>User Details</span>
                                    <i
                                        className={`bi ${openSection === "user" ? "bi-chevron-up" : "bi-chevron-down"
                                            }`}
                                    ></i>
                                </div>
                                <div className={`collapse mt-3 ${openSection === "user" ? "show" : ""}`}>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Name</div>
                                        <div className="col-lg-8">{userName}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Email</div>
                                        <div className="col-lg-8">{emailAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Phone</div>
                                        <div className="col-lg-8">{formatPhoneNumber(phoneNumber)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Payment Address</div>
                                        <div className="col-lg-8">{paymentAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Shipping Address</div>
                                        <div className="col-lg-8">{shippingAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Active</div>
                                        <div className="col-lg-8">{getActiveStatus(userActive)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Created At</div>
                                        <div className="col-lg-8">{formatDateTime(userCreatedAt)}</div>
                                    </div>
                                </div>
                                <hr />
                                {/* PRODUCT DETAILS TOGGLE */}
                                <div
                                    className="d-flex justify-content-between align-items-center fw-bold"
                                    onClick={() => handleToggle("product")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <span>Products List</span>
                                    <i
                                        className={`bi ${openSection === "product" ? "bi-chevron-up" : "bi-chevron-down"
                                            }`}
                                    ></i>
                                </div>
                                {productDetails?.map((product, index) => (
                                    <div key={product.productId} className={`collapse mt-3 ${openSection === "product" ? "show" : ""}`}>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Product {index + 1}</div>
                                            <div className="col-lg-8">{product.productName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Category</div>
                                            <div className="col-lg-8">{product?.categoryInfo?.categoryName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Sub Category</div>
                                            <div className="col-lg-8">{product?.subCategoryInfo?.subCategoryName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Language</div>
                                            <div className="col-lg-8">{product?.languageInfo?.languageName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Brand</div>
                                            <div className="col-lg-8">{product.productBrand}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">#Code</div>
                                            <div className="col-lg-8">{product.productCode}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Price</div>
                                            <div className="col-lg-8">{product.productPrice}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Stock</div>
                                            <div className="col-lg-8">{getStockStatus(product.productStock)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Active</div>
                                            <div className="col-lg-8">{getActiveStatus(product.productActive)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-4 fw-bold">Created At</div>
                                            <div className="col-lg-8">{formatDateTime(product.productCreatedAt)}</div>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                {/* BASIC INFO */}
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                    <div className="col-lg-9 col-md-8">{actionBy}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Shipping Method</div>
                                    <div className="col-lg-9 col-md-8">
                                        {getShippingMethod(shippingMethod)}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Payment Method</div>
                                    <div className="col-lg-9 col-md-8">
                                        {getPaymentMethod(paymentMethod)}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Payment Amount</div>
                                    <div className="col-lg-9 col-md-8">
                                        {paymentAmount}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Delivery In Days</div>
                                    <div className="col-lg-9 col-md-8">
                                        {deliveryInDays}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Payment Status</div>
                                    <div className="col-lg-9 col-md-8">
                                        {getPaymentStatus(paymentStatus)}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Order Status</div>
                                    <div className="col-lg-9 col-md-8">
                                        {getOrderStatus(orderStatus)}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Payment Date-Time</div>
                                    <div className="col-lg-9 col-md-8">
                                        {formatDateTime(paymentDateTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="view"
                            onCancel={() => { }}
                            submitText="Close"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}