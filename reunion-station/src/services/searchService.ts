import type {
  SearchParams,
  SearchResult,
  MatchResult,
  SearchHistory,
  SavedSearch,
} from "@/types/search";

class SearchService {
  private baseURL = "http://localhost:3001/api";

  async search(params: SearchParams): Promise<SearchResult> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(","));
          } else if (typeof value === "object") {
            searchParams.append(key, JSON.stringify(value));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${this.baseURL}/search?${searchParams}`);

      if (!response.ok) {
        throw new Error("搜索失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getSearchSuggestions(keyword: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/search/suggestions?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      if (!response.ok) {
        throw new Error("获取建议失败");
      }

      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async getMatches(token: string): Promise<MatchResult[]> {
    try {
      const response = await fetch(`${this.baseURL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取匹配结果失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async confirmMatch(token: string, matchId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/matches/${matchId}/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("确认失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async rejectMatch(
    token: string,
    matchId: string,
    reason?: string
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/matches/${matchId}/reject`,
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
        throw new Error("拒绝失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async saveSearch(
    token: string,
    name: string,
    params: SearchParams
  ): Promise<SavedSearch> {
    try {
      const response = await fetch(`${this.baseURL}/search/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, params }),
      });

      if (!response.ok) {
        throw new Error("保存失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getSavedSearches(token: string): Promise<SavedSearch[]> {
    try {
      const response = await fetch(`${this.baseURL}/search/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取保存的搜索失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getSearchHistory(token: string): Promise<SearchHistory[]> {
    try {
      const response = await fetch(`${this.baseURL}/search/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取搜索历史失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async deleteSearchHistory(token: string, historyId: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseURL}/search/history/${historyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("删除失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }
}

export const searchService = new SearchService();
