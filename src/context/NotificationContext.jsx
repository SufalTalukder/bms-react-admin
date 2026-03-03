import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAllNotificationsApi } from "../api/notification-api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const hasFetched = useRef(false);

    const unreadCount = notifications.filter(
        n => n.markAsRead === "UNREAD"
    ).length;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getAllNotificationsApi();
            const data = res.data?.content || [];
            const sorted = [...data].reverse();
            setNotifications(sorted);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications,
                unreadCount,
                fetchNotifications,
                loading
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired
};