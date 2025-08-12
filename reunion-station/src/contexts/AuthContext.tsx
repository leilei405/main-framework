"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import { message } from "antd";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化时检查本地存储的token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          // TODO: 验证token有效性，获取用户信息
          // 这里模拟API调用
          const mockUser: User = {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            phone: "13800138000",
            role: "user",
            createdAt: new Date().toISOString(),
          };
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: mockUser, token },
          });
        } catch (error) {
          localStorage.removeItem("auth_token");
          dispatch({ type: "LOGIN_FAILURE" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // TODO: 实际的API调用
      // 这里模拟登录API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        credentials.username === "admin" &&
        credentials.password === "admin"
      ) {
        const mockUser: User = {
          id: "1",
          username: credentials.username,
          email: "admin@example.com",
          phone: "13800138000",
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        const token = "mock_jwt_token_" + Date.now();

        localStorage.setItem("auth_token", token);
        dispatch({ type: "LOGIN_SUCCESS", payload: { user: mockUser, token } });
        message.success("登录成功！");
        return true;
      } else {
        throw new Error("用户名或密码错误");
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      message.error(error instanceof Error ? error.message : "登录失败");
      return false;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // TODO: 实际的API调用
      // 这里模拟注册API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟注册成功
      message.success("注册成功！请登录");
      dispatch({ type: "SET_LOADING", payload: false });
      return true;
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      message.error("注册失败");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    dispatch({ type: "LOGOUT" });
    message.success("已退出登录");
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // TODO: 实际的API调用
      if (state.user) {
        const updatedUser = { ...state.user, ...userData };
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        message.success("用户信息更新成功");
        return true;
      }
      return false;
    } catch (error) {
      message.error("更新失败");
      return false;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
