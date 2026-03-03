import DashboardLayout from "../../DashboardLayout";
import { useEffect, useState, useRef, useCallback } from "react";
import { removeNotificationApi, updateNotificationApi } from "../../api/notification-api";
import { toast } from "react-toastify";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationView() {

    const { notifications, setNotifications } = useNotifications();

    const [allNotifications, setAllNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const observer = useRef();

    useEffect(() => {
        document.title = "Manage Notifications - BMS Book Store";
    }, []);

    useEffect(() => {
        loadMoreNotifications();
    }, [page, allNotifications]);

    // INFINITE SCROLL LOADER
    const loadMoreNotifications = () => {
        if (loading) return;

        const start = (page - 1) * limit;
        const end = start + limit;
        const newData = allNotifications.slice(start, end);

        if (newData.length === 0) {
            setHasMore(false);
            return;
        }
        setNotifications(prev => [...prev, ...newData]);
    };

    // INTERSECTION OBSERVER
    const lastItemRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // MARK AS READ
    const markAsRead = async (id) => {
        try {
            await updateNotificationApi(id);
            setNotifications(prev =>
                prev.map(item =>
                    item.notificationId === id
                        ? { ...item, markAsRead: "READ" }
                        : item
                )
            );
        } catch (error) {
            toast.error("Error while updating: ", error);
            console.error("Error updating notification:", error);
        }
    };

    // REMOVE NOTIFICATION
    const deleteNotification = async (id) => {
        try {
            await removeNotificationApi(id);
            setNotifications(prev =>
                prev.filter(item => item.notificationId !== id)
            );
        } catch (error) {
            toast.error("Error while deleting: ", error);
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-layout">
                <main id="main" className="main">

                    <div className="pagetitle d-flex justify-content-between align-items-center">
                        <h1 className="toggle-heading">Manage Notifications</h1>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-body p-0">

                            {notifications.length === 0 && !loading ? (
                                <div className="text-center py-4">
                                    <p className="text-muted mb-0">
                                        No notifications available.
                                    </p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {notifications.map((notification, index) => {
                                        const isLast = index === notifications.length - 1;
                                        const isUnread = notification.markAsRead === "UNREAD";

                                        return (
                                            <div
                                                key={`${notification.notificationId}-${notification.notificationCreatedAt}`}
                                                ref={isLast ? lastItemRef : null}
                                                className={`list-group-item list-group-item-action ${isUnread ? "bg-light" : ""}`}
                                            >
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h5 className={`mb-1 ${isUnread ? "fw-bold" : ""}`}>
                                                        {notification.notificationTitle}
                                                    </h5>
                                                    <small className="text-muted noti-time">
                                                        {notification.notificationCreatedAt
                                                            ? new Date(notification.notificationCreatedAt).toLocaleString()
                                                            : ""}
                                                    </small>
                                                </div>

                                                <p className="mb-1">
                                                    {notification.notificationDescription}
                                                </p>

                                                <div className="d-flex justify-content-end gap-2 mt-2">
                                                    {isUnread && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => markAsRead(notification.notificationId)}
                                                        >
                                                            <i className="bi bi-check-all"></i>
                                                            &nbsp;Mark as Read
                                                        </button>
                                                    )}

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => deleteNotification(notification.notificationId)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {loading && (
                                        <div className="text-center py-3">
                                            <div className="spinner-border text-primary" />
                                        </div>
                                    )}

                                    {!hasMore && notifications.length > 0 && (
                                        <div className="text-center py-3 text-muted">
                                            No more notifications
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}