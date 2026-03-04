import { useState, useEffect, useCallback } from "react";

const COLORS = {
  success: { border: "#1e8e3e", bg: "#f6fef9" },
  error: { border: "#d93025", bg: "#fff8f7" },
};

let notifyFn = null;

export function notify(message, type = "success") {
  if (notifyFn) notifyFn(message, type);
}

function Toast({ id, message, type, onClose, index }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { border, bg } = COLORS[type] || COLORS.success;

  // Delay appearance by 500ms (Google-style slight delay)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onClose(id), 6000);
  }, [id, onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, 6000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  // Slide in from right, stack upward from bottom-right
  const translateX = visible && !leaving ? "0px" : "110%";
  const opacity = visible && !leaving ? 1 : 0;
  const bottom = `${24 + index * 80}px`;

  return (
    <>
      <style>{`
                @keyframes shrink {
                    from { width: 100% }
                    to   { width: 0%   }
                }
            `}</style>

      <div style={{
        position: "fixed",
        bottom,
        right: "24px",          /* Bottom-right corner */
        left: "auto",
        transform: `translateX(${translateX})`,
        opacity,
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease",
        zIndex: 9999 - index,
        width: "300px",         /* Wide like Google notification */
      }}>

        {/* Card */}
        <div className="notificationAlert" style={{
          background: bg,
          border: `1px solid ${border}25`,
          borderLeft: `4px solid ${border}`,
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 16px",
          fontFamily: "'Google Sans', 'Segoe UI', Roboto, sans-serif",
          fontSize: "15px",
          color: "#202124",
        }}>

          {/* Icon */}
          <div style={{ flexShrink: 0 }}><i className="bi bi-bell"></i></div>

          {/* Message */}
          <span style={{ flex: 1, lineHeight: "2.5", letterSpacing: "0.01em" }}>
            {message}
          </span>

          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              color: "#5f6368",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#0000000f"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "4px",
          right: 0,
          height: "3px",
          background: `${border}25`,
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: border,
            animation: "shrink 5s linear forwards",
          }} />
        </div>
      </div>
    </>
  );
}

export function NotificationAlertProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    notifyFn = (message, type) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    };
    return () => { notifyFn = null; };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <>
      {children}
      {toasts.map((toast, i) => (
        <Toast key={toast.id} {...toast} index={i} onClose={removeToast} />
      ))}
    </>
  );
}