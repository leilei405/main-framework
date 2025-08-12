// 认证相关的API服务
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseURL = "http://localhost:3001/api";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("登录失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async register(userData: RegisterData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("注册失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取用户信息失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async updateProfile(token: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("更新失败");
      }

      return await response.json();
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }

  async changePassword(
    token: string,
    passwords: { oldPassword: string; newPassword: string }
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        throw new Error("密码修改失败");
      }
    } catch (error) {
      throw new Error("网络错误，请稍后重试");
    }
  }
}

export const authService = new AuthService();
