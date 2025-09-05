"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type Notification = {
  id: string;
  title: string;
  body: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
};

type NotificationContextType = {
  notifications: Notification[];
  sendNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const sendNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto remove after duration (default 5 seconds)
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.duration || 5000);
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, sendNotification, removeNotification }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context.sendNotification;
}

function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 ${
            notification.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : notification.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : notification.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-xs mt-1 opacity-90">{notification.body}</p>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
