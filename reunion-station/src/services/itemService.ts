import type { Item, CreateItemData, ItemSearchParams } from "@/types/item";

// 重新导出类型以供其他文件使用
export type { ItemSearchParams, CreateItemData };

class ItemService {
  private baseURL = "http://localhost:3001/api";

  async createItem(token: string, itemData: CreateItemData): Promise<Item> {
    try {
      const response = await fetch(`${this.baseURL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error("发布失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getItems(
    params: ItemSearchParams = {}
  ): Promise<{ items: Item[]; total: number }> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseURL}/items?${searchParams}`);

      if (!response.ok) {
        throw new Error("获取数据失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getItemById(id: string): Promise<Item> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`);

      if (!response.ok) {
        throw new Error("获取详情失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async updateItem(
    token: string,
    id: string,
    itemData: Partial<CreateItemData>
  ): Promise<Item> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error("更新失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async deleteItem(token: string, id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("删除失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`${this.baseURL}/upload/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("图片上传失败");
      }

      const result = await response.json();
      return result.urls;
    } catch (error) {
      throw new Error("图片上传失败");
    }
  }
}

export const itemService = new ItemService();
