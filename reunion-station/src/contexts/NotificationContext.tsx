import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { message } from "antd";
import type { Notification, NotificationSettings } from "@/types/notification";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      message.error("获取通知失败");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("获取未读通知数量失败:", error);
    }
  }, [isAuthenticated]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      await refreshUnreadCount();
      message.success("已标记为已读");
    } catch (error) {
      message.error("标记已读失败");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      message.success("已全部标记为已读");
    } catch (error) {
      message.error("批量标记已读失败");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      await refreshUnreadCount();
      message.success("通知已删除");
    } catch (error) {
      message.error("删除通知失败");
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updated = await notificationService.updateNotificationSettings(
        newSettings
      );
      setSettings(updated);
      message.success("通知设置已更新");
    } catch (error) {
      message.error("更新设置失败");
    }
  };

  // 初始化数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      refreshUnreadCount();

      // 获取通知设置
      notificationService
        .getNotificationSettings()
        .then(setSettings)
        .catch(console.error);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setSettings(null);
    }
  }, [isAuthenticated, fetchNotifications, refreshUnreadCount]);

  // 定期刷新未读数量
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(refreshUnreadCount, 30000); // 30秒刷新一次
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUnreadCount]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  // if (context === undefined) {
  //   throw new Error(
  //     "useNotification must be used within a NotificationProvider"
  //   );
  // }
  return context;
}
