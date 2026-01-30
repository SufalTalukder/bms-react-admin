export function getActiveStatus(isActive) {
    switch (isActive) {
        case "YES":
            return <span className="badge bg-success rounded">Yes</span>;
        case "NO":
            return <span className="badge bg-danger rounded">No</span>;
        default:
            return <span className="badge bg-warning rounded">Unknown</span>;
    }
}

export function getAuthUserType(userType) {
    switch (userType) {
        case "SUPER_ADMIN":
            return <span className="badge bg-primary rounded">Super Admin</span>;
        case "ADMIN":
            return <span className="badge bg-secondary rounded">Admin</span>;
        default:
            return <span className="badge bg-dark rounded">Unknown</span>;
    }
}

export function getCalendarMethodDetails(method) {
    switch (method) {
        case 'POST':
            return <span className="badge bg-warning rounded">POST</span>;
        case 'GET':
            return <span className="badge bg-success rounded">GET</span>;
        case 'DELETE':
            return <span className="badge bg-danger rounded">DELETE</span>;
        case 'PUT':
            return <span className="badge bg-info rounded">PUT</span>;
        default:
            return <span className="badge bg-secondary rounded">PATCH</span>;
    }
}

// Format DOB as "Dec 25, 2023"
export function formatDOB(dateString) {

    if (dateString === null || dateString === undefined) {
        return "Invalid date";
    }

    dateString = String(dateString).trim();

    if (dateString === "" || dateString.toLowerCase() === "null") {
        return "Invalid date";
    }

    let date;
    if (/^-?\d+$/.test(dateString)) {
        const timestamp = Number(dateString);
        if (!isNaN(timestamp)) {
            date = new Date(timestamp * 1000);
        }
    }
    if (!date || isNaN(date.getTime())) {
        date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Format time "03:30 PM"
export function formatTime(value) {
    if (!value) return "";

    return new Date(value).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });
}

// Format as "Dec 25, 2023 • 03:30 PM"
export function formatDateTime(dateTimeString) {

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
}

// Format phone number as (XXX) XXX-XXXX
export function formatPhoneNumber(phone) {
    if (phone === null || phone === undefined) {
        return "Invalid phone";
    }

    const digits = String(phone).replace(/\D/g, '');

    // Expect exactly 10 digits
    if (digits.length !== 10) {
        return "Invalid phone";
    }

    const area = digits.slice(0, 3);
    const middle = digits.slice(3, 6);
    const last = digits.slice(6);

    return `(${area}) ${middle}-${last}`;
}

// GLOBAL TOASTER MESSAGES FUNCTION
const messages = {
    add: (t) => `${t} added successfully!`,
    login_add: (t) => `${t} successfully!`,
    login_failed: (t) => `${t} failed.`,
    view: (t) => `Viewing ${t} details.`,
    view_all: (t) => `Failed to fetch ${t}s.`,
    update: (t) => `${t} updated successfully!`,
    delete: (t) => `${t} deleted successfully!`,
    failed_cud: (t, d) => `Failed to ${d || 'process'} ${t}.`,
    failed_r: (t) => `Failed to fetch ${t} details.`,
    not_found: (t) => `${t} not found.`,
};

export default function toasterMsgDisplay(mode, pageTitle, detailType = '') {
    return messages[mode]?.(pageTitle, detailType) ?? 'UNKNOWN';
}
