import type {
  MissingChild,
  MissingChildTip,
  CreateMissingChildData,
  MissingChildSearchParams,
} from "@/types/missingChild";

class MissingChildService {
  private baseURL = "http://localhost:3001/api";

  async createMissingChild(
    token: string,
    childData: CreateMissingChildData
  ): Promise<MissingChild> {
    try {
      const response = await fetch(`${this.baseURL}/missing-children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        throw new Error("提交失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getMissingChildren(
    params: MissingChildSearchParams = {}
  ): Promise<{ children: MissingChild[]; total: number }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(","));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${this.baseURL}/missing-children?${searchParams}`
      );

      if (!response.ok) {
        throw new Error("获取数据失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getMissingChildById(id: string): Promise<MissingChild> {
    try {
      const response = await fetch(`${this.baseURL}/missing-children/${id}`);

      if (!response.ok) {
        throw new Error("获取详情失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async updateMissingChild(
    token: string,
    id: string,
    childData: Partial<CreateMissingChildData>
  ): Promise<MissingChild> {
    try {
      const response = await fetch(`${this.baseURL}/missing-children/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        throw new Error("更新失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async approveMissingChild(token: string, id: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/missing-children/${id}/approve`,
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
    id: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/missing-children/${id}/reject`,
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

  async submitTip(
    childId: string,
    tip: { content: string; location?: string; reporterContact?: string }
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/missing-children/${childId}/tips`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tip),
        }
      );

      if (!response.ok) {
        throw new Error("提交失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getTips(childId: string): Promise<MissingChildTip[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/missing-children/${childId}/tips`
      );

      if (!response.ok) {
        throw new Error("获取线索失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async notifyPolice(token: string, childId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/missing-children/${childId}/notify-police`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("通知失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }
}

export const missingChildService = new MissingChildService();
