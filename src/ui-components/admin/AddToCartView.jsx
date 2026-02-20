import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { ADD_TO_CARTS_PAGE_TITLE } from "../../lang-dump/lang";
import { getUsersListApi } from "../../api/users-api";
import { getProductsListApi } from "../../api/products-api";
import { toast } from "react-toastify";
import { DataTable } from "simple-datatables";
import { formatDateTime, formatDOB, formatPhoneNumber, getActiveStatus, getStockStatus } from "./FunctionHelper";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { addCartApi, deleteCartApi, getAllCartsApi, getCartDetailsApi, updateCartApi } from "../../api/add-to-cart-api";

export default function CartView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add To Cart");
    const [loading, setLoading] = useState(false);
    const [addToCartId, setAddToCartId] = useState(null);
    const [userName, setUserName] = useState("");
    const [openSection, setOpenSection] = useState(null);

    // FILTER STATES
    const [filterUserId, setFilterUserId] = useState("");
    const [filterProductId, setFilterProductId] = useState("");

    // FORM STATES
    const [userId, setUserId] = useState("");
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [actionBy, setActionBy] = useState("");
    const [cartCreateAt, setCartCreateAt] = useState("");
    const [favouritesList, setFavouritesList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [productsList, setProductsList] = useState([]);

    // FOR USER
    const [emailAddress, setUserEmail] = useState("");
    const [phoneNumber, setUserPhone] = useState("");
    const [dob, setUserDob] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userReferralCode, setUserReferralCode] = useState("");
    const [userActive, setUserActive] = useState("YES");
    const [userCreatedAt, setUserCreatedAt] = useState("");

    // FOR PRODUCT
    const [languageName, setLanguageName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productCode, setProductCode] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStock, setProductStock] = useState("IN_STOCK");
    const [productActive, setProductActive] = useState("YES");
    const [productCreatedAt, setProductCreatedAt] = useState("");

    const dataTableRef = useRef(null);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = ADD_TO_CARTS_PAGE_TITLE;
        fetchInitialData();
    }, []);

    useEffect(() => {
        loadCarts();
    }, [filterUserId, filterProductId]);

    // TOGGLE COLLAPSE SECTIONS IN VIEW MODAL
    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // FETCH ALL FILTERS LIST
    const fetchInitialData = async () => {
        try {
            const [user, prod] = await Promise.all([
                getUsersListApi(),
                getProductsListApi(0, 0, 0),
            ]);

            setUsersList(user.data?.content || []);
            setProductsList(prod.data?.content || []);
        } catch {
            toast.error("Failed to load filters.");
        }
    };

    // FETCH ALL CARTS
    const loadCarts = async () => {
        try {
            setLoading(true);

            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }

            const res = await getAllCartsApi(
                filterUserId || 0,
                filterProductId || 0
            );

            const data =
                res.data?.status === "success" ? res.data?.content : [];

            setFavouritesList(data);

            setTimeout(() => {
                if (data.length > 0) {
                    dataTableRef.current = new DataTable("#demo-table", {
                        searchable: true,
                        sortable: true,
                        perPage: 10,
                        perPageSelect: [5, 10, 25, 50, 100],
                        columns: [{ select: 0, sort: "asc" }]
                    });
                }
            }, 100);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch carts.");
        } finally {
            setLoading(false);
        }
    };

    // VIEW CART DETAILS
    const handleView = async (aid, uid) => {
        try {
            const res = await getCartDetailsApi(aid, uid);
            const cart = res.data.content;
            if (cart) {
                setIsAddModal(false);
                setModalTitle("View Cart Details");
                setActionBy(cart.authUserInfo?.authUserName);

                // USER INFO
                setUserId(cart.userInfo?.userId);
                setUserName(cart.userInfo?.fullName);
                setUserEmail(cart.userInfo?.emailAddress);
                setUserPhone(cart.userInfo?.phoneNumber);
                setUserDob(cart.userInfo?.dob);
                setUserAddress(cart.userInfo?.userAddress);
                setUserReferralCode(cart.userInfo?.userReferralCode);
                setUserActive(cart.userInfo?.userActive);
                setUserCreatedAt(cart.userInfo?.userCreatedAt);

                // PRODUCT INFO
                setProductId(cart.productInfo?.productId);
                setProductName(cart.productInfo?.productName);
                setLanguageName(cart.productInfo?.languageInfo?.languageName);
                setCategoryName(cart.productInfo?.categoryInfo?.categoryName);
                setSubCategoryName(cart.productInfo?.subCategoryInfo?.subCategoryName);
                setProductName(cart.productInfo?.productName);
                setProductBrand(cart.productInfo?.productBrand);
                setProductCode(cart.productInfo?.productCode);
                setProductPrice(cart.productInfo?.productPrice);
                setProductStock(cart.productInfo?.productStock);
                setProductActive(cart.productInfo?.productActive);
                setProductCreatedAt(cart.productInfo?.productCreatedAt);

                setCartCreateAt(cart.favouriteCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error("Cart not found.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch cart details.");
        } finally {
            setLoading(false);
        }
    };

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.error("Please select a user.");
            setLoading(false);
            return;
        }
        if (!productId) {
            toast.error("Please select a product.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            if (isAddModal) {
                await addCartApi(userId, productId);
                toast.success("Cart added successfully!");
            } else {
                await updateCartApi(addToCartId, userId, productId);
                toast.success("Cart updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                loadCarts();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save cart.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setAddToCartId(null);
        setProductId("");
        setProductName("");
        setUserId("");
        setUserName("");
        setIsAddModal(true);
        setModalTitle("Add To Cart");
    };

    // EDIT CART
    const handleEdit = (cart) => {
        setIsAddModal(false);
        setModalTitle("Update Cart");

        setAddToCartId(cart.addToCartId);
        setProductId(cart.productInfo?.productId);
        setProductName(cart.productInfo?.productName);
        setUserId(cart.userInfo?.userId);
        setUserName(cart.userInfo?.fullName);

        const modal = new window.bootstrap.Modal(
            document.getElementById("addUpdateModal")
        );
        modal.show();
    };

    // DELETE CART
    const handleDelete = async (aid, uid) => {
        try {
            await deleteCartApi(aid, uid);
            toast.success("Cart deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                loadCarts();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete cart.");
        }
    };

    // REFRESH TABLE
    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        setLoading(true);
        loadCarts();
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Favourites</h1>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => refreshTable()}
                                disabled={loading}
                                style={{ maxWidth: "170px" }}
                            >
                                <i className={`${loading ? "spinner-border spinner-border-sm me-1" : "bi bi-arrow-clockwise me-1"}`} />
                                Refresh
                            </button>
                            <select
                                className="btn btn-secondary"
                                value={filterUserId}
                                onChange={(e) => setFilterUserId(Number(e.target.value))}
                                style={{ maxWidth: "170px" }}
                            >
                                <option value="">-- User --</option>
                                {usersList.map((sc) => (
                                    <option key={`${sc.userId}-${sc.userCreatedAt}`} value={sc.userId}>{sc.fullName}</option>
                                ))}
                            </select>
                            <select
                                className="btn btn-secondary"
                                value={filterProductId}
                                onChange={(e) => setFilterProductId(Number(e.target.value))}
                                style={{ maxWidth: "170px" }}
                            >
                                <option value="">-- Product --</option>
                                {productsList.map((l) => (
                                    <option key={`${l.productId}-${l.productCreatedAt}`} value={l.productId}>{l.productName}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    resetForm();
                                    const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
                                    modal.show();
                                }}>
                                + Add Record
                            </button>
                        </div>
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
                                            <th>User</th>
                                            <th>Product</th>
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={favouritesList.length}>
                                        {loading &&
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Loading cart(s)...</strong>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && favouritesList.length === 0 &&
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No cart(s) found.
                                                </td>
                                            </tr>
                                        }
                                        {!loading &&
                                            favouritesList.map((row, index) => (
                                                <tr key={`${row.addToCartId}-${row.favouriteCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.userInfo?.fullName ?? '-'}</td>
                                                    <td>{row.productInfo?.productName ?? '-'}</td>
                                                    <td>{row.authUserInfo?.authUserName}</td>
                                                    <td>{formatDateTime(row.favouriteCreatedAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success rounded-pill me-1"
                                                            onClick={() => handleView(row.addToCartId, row.userInfo?.userId)}
                                                        >
                                                            👁️
                                                        </button>
                                                        <button className="btn btn-sm btn-info rounded-pill me-1"
                                                            onClick={() => handleEdit(row)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button className="btn btn-sm btn-danger rounded-pill"
                                                            onClick={() => {
                                                                setAddToCartId(row.addToCartId);
                                                                setUserId(row.userInfo?.userId);
                                                                setUserName(row.userInfo?.fullName);
                                                                setProductName(row.productInfo?.productName);

                                                                const modal = new window.bootstrap.Modal(
                                                                    document.getElementById("deleteModal")
                                                                );
                                                                modal.show();
                                                            }}>
                                                            🗑
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
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
                                {/* BASIC INFO */}
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">User</div>
                                    <div className="col-lg-9 col-md-8">{userName}</div>
                                </div>
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
                                        <div className="col-lg-4 fw-bold">Email</div>
                                        <div className="col-lg-8">{emailAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Phone</div>
                                        <div className="col-lg-8">{formatPhoneNumber(phoneNumber)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">DOB</div>
                                        <div className="col-lg-8">{formatDOB(dob)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Address</div>
                                        <div className="col-lg-8">{userAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Referral Code</div>
                                        <div className="col-lg-8">{userReferralCode}</div>
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
                                    <span>Product Details</span>
                                    <i
                                        className={`bi ${openSection === "product" ? "bi-chevron-up" : "bi-chevron-down"
                                            }`}
                                    ></i>
                                </div>
                                <div className={`collapse mt-3 ${openSection === "product" ? "show" : ""}`}>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Product</div>
                                        <div className="col-lg-8">{productName}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Category</div>
                                        <div className="col-lg-8">{categoryName}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Sub Category</div>
                                        <div className="col-lg-8">{subCategoryName}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Language</div>
                                        <div className="col-lg-8">{languageName}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Brand</div>
                                        <div className="col-lg-8">{productBrand}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">#Code</div>
                                        <div className="col-lg-8">{productCode}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Price</div>
                                        <div className="col-lg-8">{productPrice}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Stock</div>
                                        <div className="col-lg-8">{getStockStatus(productStock)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Active</div>
                                        <div className="col-lg-8">{getActiveStatus(productActive)}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Created At</div>
                                        <div className="col-lg-8">{formatDateTime(productCreatedAt)}</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                    <div className="col-lg-9 col-md-8">{actionBy}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                    <div className="col-lg-9 col-md-8">
                                        {formatDateTime(cartCreateAt)}
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

            {/* ADD MODAL */}
            {/* OR, UPDATE MODAL */}
            <div className="modal fade" id="addUpdateModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-xl" style={{ maxHeight: "75vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="row g-3 p-3">
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select User *</label>
                                        <select className="form-select form-control" value={userId} onChange={(e) => setUserId(Number(e.target.value))} required>
                                            <option value="">-- Select --</option>
                                            {usersList.map((row) => (
                                                <option key={`${row.userId}-${row.userCreatedAt}`} value={row.userId}>{row.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select Product *</label>
                                        <select
                                            className="form-select form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(Number(e.target.value))}
                                            required
                                        >
                                            <option value="">-- Select --</option>
                                            {productsList.map((row) => (
                                                <option
                                                    key={`${row.productId}-${row.productCreatedAt}`}
                                                    value={row.productId}
                                                >
                                                    {row.productName}
                                                </option>
                                            ))}
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
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this Cart of this user <strong>`{productName}`</strong>?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(addToCartId, userId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
