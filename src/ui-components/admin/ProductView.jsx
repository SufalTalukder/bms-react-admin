import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../DashboardLayout";
import { DataTable } from "simple-datatables";
import { toast } from "react-toastify";
import { } from "../../api/users-api";
import profileImg from '../../assets/img/profile-img.jpg';
import { formatDateTime, getActiveStatus, getStockStatus } from "./FunctionHelper";
import ReusableModalButtons from "../reusable-components/ReusableModalButtons";
import { ReusableExportTable } from "../reusable-components/ResuableExportTable";
import { addProductApi, deleteProductApi, getProductDetailsApi, getProductsListApi, updateProductApi } from "../../api/products-api";
import { getAllLanguagesApi } from "../../api/languages-api";
import { getCategoriesListApi } from "../../api/categories-api";
import { getSubCategoriesListApi } from "../../api/sub-categories-api";

export default function ProductView() {

    // STATE VARIABLES
    const [isAddModal, setIsAddModal] = useState(true);
    const [modalTitle, setModalTitle] = useState("Add Product");
    const [productId, setProductId] = useState(0);
    const [authUserName, setAuthUserName] = useState("");
    const [languageId, setLanguageId] = useState(0);
    const [languageName, setLanguageName] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [categoryName, setCategoryName] = useState("");
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [subCategoryName, setSubCategoryName] = useState("");
    const [productName, setProductName] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productCode, setProductCode] = useState("");
    const [productAvailability, setProductAvailability] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [productStock, setProductStock] = useState("IN_STOCK");
    const [productActive, setProductActive] = useState("YES");
    const [productCreatedAt, setProductCreatedAt] = useState("");
    const [productImage, setProductImage] = useState("");

    const [productsList, setProductsList] = useState([]);
    const [languagesList, setLanguagesList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);

    const [loading, setLoading] = useState(true);

    const dataTableRef = useRef(null);
    const hasFetched = useRef(false);
    const tableRef = useRef(null);

    useEffect(() => {
        document.title = "Manage Products | Admin Panel";
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchInitialData();
    }, []);

    // FETCH ALL PRODUCTS
    const fetchInitialData = async () => {
        try {
            const [cat, subCat, lang] = await Promise.all([
                getCategoriesListApi(),
                getSubCategoriesListApi(),
                getAllLanguagesApi()
            ]);

            setCategoriesList(cat.data.content || []);
            setSubCategoriesList(subCat.data.content || []);
            setLanguagesList(lang.data.content || []);
        } catch {
            toast.error("Failed to load filters.");
        }
    };

    useEffect(() => {
        loadProducts();
    }, [categoryId, subCategoryId, languageId]);

    const loadProducts = async () => {
        try {
            setLoading(true);

            const res = await getProductsListApi(
                categoryId || 0,
                subCategoryId || 0,
                languageId || 0
            );

            setProductsList(
                res.data.status === "success" ? res.data.content : []
            );
        } catch (e) {
            setProductsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dataTableRef.current && productsList.length > 0) {
            dataTableRef.current = new DataTable("#demo-table", {
                searchable: true,
                sortable: true,

                perPage: 10,
                perPageSelect: [5, 10, 25, 50, 100],

                columns: [
                    { select: 0, sort: "asc" }
                ]
            });
        }
    }, [productsList]);

    // VIEW PRODUCT
    const handleView = async (id) => {
        try {
            const res = await getProductDetailsApi(id);
            const product = res.data.content;
            if (product) {
                setIsAddModal(false);
                setModalTitle("View Product Details");
                setProductId(product.productId);
                setAuthUserName(product.authUserInfo?.authUserName);
                setLanguageName(product.languageInfo?.languageName);
                setCategoryName(product.categoryInfo?.categoryName);
                setSubCategoryName(product.subCategoryInfo?.subCategoryName);
                setProductName(product.productName);
                setProductBrand(product.productBrand);
                setProductCode(product.productCode);
                setProductAvailability(product.productAvailability);
                setProductPrice(product.productPrice);
                setProductDetails(product.productDetails);
                setProductStock(product.productStock);
                setProductActive(product.productActive);
                setProductImage(product.productImage);
                setProductCreatedAt(product.productCreatedAt);
                const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
                modal.show();
            } else {
                toast.error("Product not found.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch product details.");
        } finally {
            setLoading(false);
        }
    };

    // HANDLE SUBMIT FOR ADD/UPDATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (
            !productName.trim()
            || !productBrand.trim()
            || !productCode
            || !productAvailability
            || !productPrice
            || !productDetails.trim()
            || !productStock.trim()
            || !productActive.trim()
        ) {
            toast.error("Please fill all required fields.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("productBrand", productBrand);
        formData.append("productCode", productCode);
        formData.append("productAvailability", productAvailability);
        formData.append("productPrice", productPrice);
        formData.append("productDetails", productDetails);
        formData.append("productStock", productStock);
        formData.append("productActive", productActive);
        if (productImage) formData.append("productImage", productImage);

        try {
            if (isAddModal) {
                await addProductApi(categoryId, subCategoryId, languageId, formData);
                toast.success("Product added successfully!");
            } else {
                await updateProductApi(productId, categoryId, subCategoryId, languageId, formData);
                toast.success("Product updated successfully!");
            }
            setTimeout(() => {
                resetForm();
                loadProducts();
                window.bootstrap.Modal.getInstance(document.getElementById("addUpdateModal")).hide();
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save product.");
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const resetForm = () => {
        setProductId(0);
        setProductName("");
        setCategoryId(0);
        setCategoryName("");
        setSubCategoryId(0);
        setSubCategoryName("");
        setLanguageId(0);
        setLanguageName("");
        setProductBrand("");
        setProductCode("");
        setProductAvailability("");
        setProductPrice("");
        setProductDetails("");
        setProductStock("IN_STOCK");
        setProductActive("YES");
        setProductImage("");
        setIsAddModal(true);
        setModalTitle("Add Product");
    };

    // EDIT PRODUCT
    const handleEdit = (product) => {
        setIsAddModal(false);
        setModalTitle("Update Product");
        setProductId(product.productId);
        setProductName(product.productName);
        setCategoryId(product.categoryInfo?.categoryId);
        setSubCategoryId(product.subCategoryInfo?.subCategoryId);
        setLanguageId(product.languageInfo?.languageId);
        setProductBrand(product.productBrand);
        setProductCode(product.productCode);
        setProductAvailability(product.productAvailability);
        setProductPrice(product.productPrice);
        setProductDetails(product.productDetails);
        setProductStock(product.productStock);
        setProductActive(product.productActive);
        setProductImage(product.productImage);
        const modal = new window.bootstrap.Modal(document.getElementById("addUpdateModal"));
        modal.show();
    };

    // DELETE PRODUCT
    const handleDelete = async (id) => {
        try {
            await deleteProductApi(id);
            toast.success("Product deleted successfully!");

            setTimeout(() => {
                window.bootstrap.Modal
                    .getInstance(document.getElementById("deleteModal"))
                    ?.hide();
                loadProducts();
            }, 1000);
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">
                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Products</h1>
                        <div className="d-flex justify-content-end gap-2">
                            <select
                                className="form-select"
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                style={{ maxWidth: "150px" }}
                            >
                                <option value="">-- Category --</option>
                                {categoriesList.map((c) => (
                                    <option key={`${c.categoryId}-${c.categoryCreatedAt}`} value={c.categoryId}>{c.categoryName}</option>
                                ))}
                            </select>
                            <select
                                className="form-select"
                                value={subCategoryId}
                                onChange={(e) => setSubCategoryId(Number(e.target.value))}
                                style={{ maxWidth: "150px" }}
                            >
                                <option value="">-- Subcategory --</option>
                                {subCategoriesList.map((sc) => (
                                    <option key={`${sc.subCategoryId}-${sc.subCategoryCreatedAt}`} value={sc.subCategoryId}>{sc.subCategoryName}</option>
                                ))}
                            </select>
                            <select
                                className="form-select"
                                value={languageId}
                                onChange={(e) => setLanguageId(Number(e.target.value))}
                                style={{ maxWidth: "150px" }}
                            >
                                <option value="">-- Language --</option>
                                {languagesList.map((l) => (
                                    <option key={`${l.languageId}-${l.languageCreatedAt}`} value={l.languageId}>{l.languageName}</option>
                                ))}
                            </select>
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
                                            <th>Name</th>
                                            <th>Brand</th>
                                            <th>Availability</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Action By</th>
                                            <th>Created At</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody key={productsList.length}>
                                        {loading && (
                                            <tr>
                                                <td colSpan="11" className="text-center py-4">
                                                    <div className="spinner-border spinner-border-sm"></div>
                                                    <strong className="ms-2">Product(s) Loading...</strong>
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && productsList.length === 0 && (
                                            <tr>
                                                <td colSpan="11" className="text-center py-4">
                                                    No product(s) found.
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && productsList.map((row, index) => (
                                            <tr key={`${row.productId}-${row.productCreatedAt}`}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img src={row.productImage ? `${import.meta.env.VITE_8086_API_BASE}/uploads/${row.productImage}` : profileImg} style={{ maxHeight: "70px", maxWidth: "80px" }} alt="productImage" />
                                                </td>
                                                <td>{row.productName}</td>
                                                <td>{row.productBrand}</td>
                                                <td className="text-truncate" style={{ maxWidth: 250 }}>
                                                    {row.productAvailability}
                                                </td>
                                                <td>{row.productPrice}</td>
                                                <td>{getStockStatus(row.productStock)}</td>
                                                <td>{row.authUserInfo?.authUserName ?? '-'}</td>
                                                <td>{formatDateTime(row.productCreatedAt)}</td>
                                                <td>{getActiveStatus(row.productActive)}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success rounded-pill me-1"
                                                        onClick={() => handleView(row.productId)}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button className="btn btn-sm btn-info rounded-pill me-1"
                                                        onClick={() => handleEdit(row)}>
                                                        ✏️
                                                    </button>
                                                    <button className="btn btn-sm btn-danger rounded-pill"
                                                        onClick={() => {
                                                            setProductId(row.productId);
                                                            setProductName(row.productName);
                                                            const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
                                                            modal.show();
                                                        }}>
                                                        🗑
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview">
                                        <div className="d-flex justify-content-center mb-4">
                                            <img src={productImage ? `${import.meta.env.VITE_8086_API_BASE}/uploads/${productImage}` : profileImg} alt="Profile" className="rounded-circle border" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Name</div>
                                            <div className="col-lg-9 col-md-8">{productName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Brand</div>
                                            <div className="col-lg-9 col-md-8">{productBrand}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">#Code</div>
                                            <div className="col-lg-9 col-md-8">{productCode}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Availability</div>
                                            <div className="col-lg-9 col-md-8">{productAvailability}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Price</div>
                                            <div className="col-lg-9 col-md-8">{productPrice}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Details</div>
                                            <div className="col-lg-9 col-md-8" style={{ wordWrap: "break-word" }}>{productDetails}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Stock</div>
                                            <div className="col-lg-9 col-md-8">{getStockStatus(productStock)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Active</div>
                                            <div className="col-lg-9 col-md-8">{getActiveStatus(productActive)}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Action By</div>
                                            <div className="col-lg-9 col-md-8">{authUserName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Language</div>
                                            <div className="col-lg-9 col-md-8">{languageName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Category</div>
                                            <div className="col-lg-9 col-md-8">{categoryName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Subcategory</div>
                                            <div className="col-lg-9 col-md-8">{subCategoryName}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-md-4 fw-bold">Created At</div>
                                            <div className="col-lg-9 col-md-8">{formatDateTime(productCreatedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="view"
                            onCancel={() => { }}
                            submitText="view"
                        />
                    </div>
                </div>
            </div>

            {/* ADD MODAL */}
            {/* OR, UPDATE MODAL */}
            <div className="modal fade" id="addUpdateModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ maxHeight: "75vh" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm} />
                        </div>
                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                            <div className="modal-body">
                                <div className="row g-3 p-3">
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Product Name *</label>
                                        <input type="text" className="form-control" maxLength="100" value={productName} onChange={(e) => setProductName(e.target.value)} autoComplete="new-name" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select Category *</label>
                                        <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            {categoriesList.map((row) => (
                                                <option key={`${row.categoryId}-${row.categoryCreatedAt}`} value={row.categoryId}>{row.categoryName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select Subcategory *</label>
                                        <select className="form-select" value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            {subCategoriesList.map((row) => (
                                                <option key={`${row.subCategoryId}-${row.subCategoryCreatedAt}`} value={row.subCategoryId}>{row.subCategoryName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Select Language *</label>
                                        <select className="form-select" value={languageId} onChange={(e) => setLanguageId(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            {languagesList.map((row) => (
                                                <option key={`${row.languageId}-${row.languageCreatedAt}`} value={row.languageId}>{row.languageName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Brand *</label>
                                        <input type="text" className="form-control" maxLength="50" value={productBrand} onChange={(e) => setProductBrand(e.target.value)} autoComplete="new-email" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">#Code *</label>
                                        <input type="text" className="form-control" minLength="10" maxLength="10" value={productCode} onChange={(e) => setProductCode(e.target.value)} autoComplete="new-phone-number" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Availability *</label>
                                        <input type="number" className="form-control" value={productAvailability} onChange={(e) => setProductAvailability(e.target.value)} required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Price *</label>
                                        <input type="number" className="form-control" maxLength="50" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} autoComplete="new-address" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Details *</label>
                                        <input type="text" className="form-control" value={productDetails} onChange={(e) => setProductDetails(e.target.value)} autoComplete="new-address" required />
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Stock *</label>
                                        <select className="form-select" value={productStock} onChange={(e) => setProductStock(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="IN_STOCK">In Stock</option>
                                            <option value="OUT_OF_STOCK">Out of Stock</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Active *</label>
                                        <select className="form-select" value={productActive} onChange={(e) => setProductActive(e.target.value)} required>
                                            <option value="">-- Select --</option>
                                            <option value="YES">Yes</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4" style={{ textAlign: "left" }}>
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setProductImage(e.target.files[0])}
                                            accept=".jpg,.jpeg,.png"
                                        />
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
            </div >

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
                            <p>Are you sure you want to delete this `{productName}` Product?</p>
                        </div>
                        <ReusableModalButtons
                            loading={loading}
                            mode="delete"
                            onCancel={() => { }}
                            submitText="Yes"
                            onSubmit={() => handleDelete(productId)}
                        />
                    </div>
                </div>
            </div >
        </DashboardLayout >
    );
}
