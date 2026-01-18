export const getActiveStatus = (isActive) => {
    switch (isActive) {
        case "YES":
            return <span className="badge bg-success rounded">Yes</span>;
        case "NO":
            return <span className="badge bg-danger rounded">No</span>;
        default:
            return <span className="badge bg-warning rounded">Unknown</span>;
    }
};

export const getAuthUserType = ($userType) => {
    switch ($userType) {
        case "SUPER_ADMIN":
            return <span className="badge bg-primary rounded">Super Admin</span>;
        case "ADMIN":
            return <span className="badge bg-secondary rounded">Admin</span>;
        default:
            return <span className="badge bg-dark rounded">Unknown</span>;
    }
};

// Format as "Dec 25, 2023 • 03:30 PM"
export const formatDateTime = (dateTimeString) => {
    if (dateTimeString === null || dateTimeString === undefined) {
        return "Invalid date";
    }

    dateTimeString = String(dateTimeString).trim();

    if (dateTimeString === "" || dateTimeString.toLowerCase() === "null") {
        return "Invalid date";
    }

    let date;
    if (/^-?\d+$/.test(dateTimeString)) {
        const timestamp = Number(dateTimeString);
        if (!isNaN(timestamp)) {
            date = new Date(timestamp * 1000);
        }
    }
    if (!date || isNaN(date.getTime())) {
        date = new Date(dateTimeString);
    }
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).replace(",", " •");
};
