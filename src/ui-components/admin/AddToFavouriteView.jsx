import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../DashboardLayout";
import { toast } from "react-toastify";
import { DataTable } from "simple-datatables";
import { getUsersListApi } from "../../api/users-api";
import { getProductsListApi } from "../../api/products-api";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { formatDateTime, getActiveStatus, getStockStatus } from "../admin/FunctionHelper";
import { addFavouriteApi, deleteFavouriteApi, getAllFavouritesApi, getFavouriteDetailsApi, updateFavouriteApi } from "../../api/add-to-cart-api";
import { ADD_TO_FAVOURITES_PAGE_TITLE } from "../../lang-dump/lang";

export default function AddToFavouriteView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add To Favourite");
    const [loading, setLoading] = useState(false);
    const [addToFavouriteId, setAddToFavouriteId] = useState(null);
    const [userName, setUserName] = useState("");

    // FILTER STATES (Top Dropdowns)
    const [filterUserId, setFilterUserId] = useState("");
    const [filterProductId, setFilterProductId] = useState("");

    // FORM STATES (Add/Update Modal)
    const [userId, setUserId] = useState("");
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [actionBy, setActionBy] = useState("");
    const [favouriteCreateAt, setFavouriteCreateAt] = useState("");
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
        document.title = ADD_TO_FAVOURITES_PAGE_TITLE;
        fetchInitialData();
    }, []);

    useEffect(() => {
        loadFavourites();
    }, [filterUserId, filterProductId]);

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

    // FETCH ALL FAVOURITES
    const loadFavourites = async () => {
        try {
            setLoading(true);

            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }

            const res = await getAllFavouritesApi(
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
            toast.error("Failed to fetch favourites.");
        } finally {
            setLoading(false);
        }
    };

    // VIEW FAVOURITE DETAILS
    const handleView = async (aid, uid) => {
        try {
            const res = await getFavouriteDetailsApi(aid, uid);
            const favourite = res.data.content;
            if (favourite) {
                setIsAddModal(false);
                setModalTitle("View Favourite Details");
                setActionBy(favourite.authUserInfo?.authUserName);

                // USER INFO
                setUserId(favourite.userInfo?.userId);
                setUserName(favourite.userInfo?.fullName);
                setUserEmail(favourite.userInfo?.emailAddress);
                setUserPhone(favourite.userInfo?.phoneNumber);
                setUserDob(favourite.userInfo?.dob);
                setUserAddress(favourite.userInfo?.userAddress);
                setUserReferralCode(favourite.userInfo?.userReferralCode);
                setUserActive(favourite.userInfo?.userActive);
                setUserCreatedAt(favourite.userInfo?.userCreatedAt);

                // PRODUCT INFO
                setProductId(favourite.productInfo?.productId);
                setProductName(favourite.productInfo?.productName);
                setLanguageName(favourite.productInfo?.languageInfo?.languageName);
                setCategoryName(favourite.productInfo?.categoryInfo?.categoryName);
                setSubCategoryName(favourite.productInfo?.subCategoryInfo?.subCategoryName);
                setProductName(favourite.productInfo?.productName);
                setProductBrand(favourite.productInfo?.productBrand);
                setProductCode(favourite.productInfo?.productCode);
                setProductPrice(favourite.productInfo?.productPrice);
                setProductStock(favourite.productInfo?.productStock);
                setProductActive(favourite.productInfo?.productActive);
                setProductCreatedAt(favourite.productInfo?.productCreatedAt);

                setFavouriteCreateAt(favourite.favouriteCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error("Favourite not found.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch favourite details.");
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
                await addFavouriteApi(userId, productId);
                toast.success("Favourite added successfully!");
            } else {
                await updateFavouriteApi(addToFavouriteId, userId, productId);
                toast.success("Favourite updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                loadFavourites();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save favourite.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setAddToFavouriteId(null);
        setProductId("");
        setProductName("");
        setUserId("");
        setUserName("");
        setIsAddModal(true);
        setModalTitle("Add To Favourite");
    };

    // EDIT FAVOURITE
    const handleEdit = (favourite) => {
        setIsAddModal(false);
        setModalTitle("Update Favourite");

        setAddToFavouriteId(favourite.addToFavouriteId);
        setProductId(favourite.productInfo?.productId);
        setProductName(favourite.productInfo?.productName);
        setUserId(favourite.userInfo?.userId);
        setUserName(favourite.userInfo?.fullName);

        const modal = new window.bootstrap.Modal(
            document.getElementById("addUpdateModal")
        );
        modal.show();
    };

    // DELETE FAVOURITE
    const handleDelete = async (aid, uid) => {
        try {
            await deleteFavouriteApi(aid, uid);
            toast.success("Favourite deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                loadFavourites();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete favourite.");
        }
    };

    // REFRESH TABLE
    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
        }
        setLoading(true);
        loadFavourites();
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
                                                    <strong className="ms-2">Loading favourite(s)...</strong>
                                                </td>
                                            </tr>
                                        }
                                        {!loading && favouritesList.length === 0 &&
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No favourite(s) found.
                                                </td>
                                            </tr>
                                        }
                                        {!loading &&
                                            favouritesList.map((row, index) => (
                                                <tr key={`${row.addToFavouriteId}-${row.favouriteCreatedAt}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.userInfo?.fullName ?? '-'}</td>
                                                    <td>{row.productInfo?.productName ?? '-'}</td>
                                                    <td>{row.authUserInfo?.authUserName}</td>
                                                    <td>{formatDateTime(row.favouriteCreatedAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success rounded-pill me-1"
                                                            onClick={() => handleView(row.addToFavouriteId, row.userInfo?.userId)}
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
                                                                setAddToFavouriteId(row.addToFavouriteId);
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
                                <div className="d-flex justify-content-between align-items-center fw-bold cursor-pointer" data-bs-toggle="collapse" data-bs-target="#userDetails" aria-expanded="false">
                                    <span>User Details</span>
                                    <i className="bi bi-chevron-down toggle-icon"></i>
                                </div>
                                <div className="collapse mt-3" id="userDetails">
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Email</div>
                                        <div className="col-lg-8">{emailAddress}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">Phone</div>
                                        <div className="col-lg-8">{phoneNumber}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-lg-4 fw-bold">DOB</div>
                                        <div className="col-lg-8">{dob}</div>
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
                                <div className="d-flex justify-content-between align-items-center fw-bold cursor-pointer" data-bs-toggle="collapse" data-bs-target="#productDetails" aria-expanded="false">
                                    <span>Product Details</span>
                                    <i className="bi bi-chevron-down toggle-icon"></i>
                                </div>
                                <div className="collapse mt-3" id="productDetails">
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
                                        {formatDateTime(favouriteCreateAt)}
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
                            <p>Are you sure you want to delete this Favourite of this user <strong>`{productName}`</strong>?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(addToFavouriteId, userId)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
