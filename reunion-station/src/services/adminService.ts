import type {
  AdminStats,
  UserManagement,
  Report,
  AuditLog,
  UserStatus,
  ReportStatus,
} from "@/types/admin";
import type { Item } from "@/types/item";
import type { MissingChild } from "@/types/missingChild";

class AdminService {
  private baseURL = "http://localhost:3001/api";
  async getStats(token: string): Promise<AdminStats> {
    try {
      const response = await fetch(`${this.baseURL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取统计数据失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getUsers(
    token: string,
    params: { page?: number; limit?: number; status?: UserStatus } = {}
  ): Promise<{
    users: UserManagement[];
    total: number;
  }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${this.baseURL}/admin/users?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("获取用户列表失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async updateUserStatus(
    token: string,
    userId: string,
    status: UserStatus,
    reason?: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, reason }),
        }
      );

      if (!response.ok) {
        throw new Error("更新用户状态失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getPendingItems(token: string): Promise<Item[]> {
    try {
      const response = await fetch(`${this.baseURL}/admin/items/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取待审核物品失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async approveItem(token: string, itemId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/items/${itemId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("审核失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async rejectItem(
    token: string,
    itemId: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/items/${itemId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("审核失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getPendingMissingChildren(token: string): Promise<MissingChild[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/missing-children/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("获取待审核失踪儿童信息失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async approveMissingChild(token: string, childId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/missing-children/${childId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("审核失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async rejectMissingChild(
    token: string,
    childId: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/missing-children/${childId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("审核失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getReports(
    token: string,
    params: { status?: ReportStatus; page?: number; limit?: number } = {}
  ): Promise<{
    reports: Report[];
    total: number;
  }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${this.baseURL}/admin/reports?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("获取举报列表失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async resolveReport(
    token: string,
    reportId: string,
    resolution: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/reports/${reportId}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution }),
        }
      );

      if (!response.ok) {
        throw new Error("处理举报失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async dismissReport(
    token: string,
    reportId: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/reports/${reportId}/dismiss`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("驳回举报失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getAuditLogs(
    token: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${this.baseURL}/admin/audit-logs?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("获取审计日志失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }
}

export const adminService = new AdminService();
