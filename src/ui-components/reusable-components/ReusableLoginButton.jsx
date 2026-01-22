import React from 'react';

const ReusableLoginButton = ({ loading, buttonType, buttonText }) => {
    return (
        <button
            className="btn btn-primary w-100"
            type={buttonType}
            disabled={loading}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </>
            ) : (
                buttonText ?? "Login"
            )}
        </button>
    );
};

export default ReusableLoginButton;