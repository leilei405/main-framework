import type {
  Notification,
  NotificationSettings,
  CreateNotificationRequest,
  NotificationFilter,
} from "@/types/notification";

const API_BASE_URL = "http://localhost:3001";

export const notificationService = {
  // 获取用户通知列表
  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (filter?.type) params.append("type", filter.type);
    if (filter?.isRead !== undefined)
      params.append("isRead", filter.isRead.toString());
    if (filter?.startDate) params.append("startDate", filter.startDate);
    if (filter?.endDate) params.append("endDate", filter.endDate);

    const response = await fetch(
      `${API_BASE_URL}/api/notifications?${params}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("获取通知失败");
    }

    return response.json();
  },

  // 获取未读通知数量
  async getUnreadCount(): Promise<number> {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/unread-count`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("获取未读通知数量失败");
    }

    const data = await response.json();
    return data.count;
  },

  // 标记通知为已读
  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("标记通知已读失败");
    }
  },

  // 批量标记为已读
  async markAllAsRead(): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/mark-all-read`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("批量标记已读失败");
    }
  },

  // 删除通知
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("删除通知失败");
    }
  },

  // 创建通知（管理员功能）
  async createNotification(
    data: CreateNotificationRequest
  ): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("创建通知失败");
    }

    return response.json();
  },

  // 获取通知设置
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("获取通知设置失败");
    }

    return response.json();
  },

  // 更新通知设置
  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("更新通知设置失败");
    }

    return response.json();
  },
};
