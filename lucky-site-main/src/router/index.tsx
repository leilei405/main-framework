import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

/** 布局组件 */
const LayoutPage = lazy(() => import("../layout"));
/** 首页 */
const Home = lazy(() => import("../pages/HomePage"));
/** 面试宝典 */
const InterviewPage = lazy(() => import("../pages/InterviewPage"));
/** 工具 */
const ToolsPage = lazy(() => import("../pages/ToolsPage"));
/** 博客 */
const BlogPage = lazy(() => import("../pages/BlogPage"));
/** 简历 */
const ResumePage = lazy(() => import("../pages/ResumePage"));
/** 登录 */
const Login = lazy(() => import("../pages/LoginPage"));
/** 注册 */
const Register = lazy(() => import("../pages/RegisterPage"));
/** 404 未找到 */
const NotFoundPage = lazy(() => import("../pages/NotFound"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "interview",
        element: <InterviewPage />,
      },
      {
        path: "tools",
        element: <ToolsPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "resume",
        element: <ResumePage />,
      },
      {
        path: "*", // 404配置路由 都写在最后兜底
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
