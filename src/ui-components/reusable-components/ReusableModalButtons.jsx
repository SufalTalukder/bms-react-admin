import PropTypes from "prop-types";

export default function ReusableModalButtons({ loading = false, mode = "add", onCancel, onSubmit, submitText }) {

    const modalBtnText =
        submitText ?? (mode === "add" ? "Save" : mode === "edit" ? "Update" : mode === "delete" ? "Yes" : "OK");

    return (
        <div className="modal-footer">

            {mode !== "view" && (
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {mode === "delete" ? "No" : "Cancel"}
                </button>
            )}

            {mode !== "view" && (
                <button
                    type={mode === "delete" ? "button" : "submit"}
                    className={`btn ${mode === "delete" ? "btn-danger" : "btn-primary"}`}
                    onClick={mode === "delete" ? onSubmit : undefined}
                    disabled={loading}
                >
                    {loading && (
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                    {!loading && modalBtnText}
                </button>
            )}
        </div>
    );
}

ReusableModalButtons.propTypes = {
    loading: PropTypes.bool,
    mode: PropTypes.oneOf(["add", "edit", "delete", "view"]),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
};
