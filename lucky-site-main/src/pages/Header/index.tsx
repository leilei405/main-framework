import { Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "首页", path: "/" },
  { name: "前端面试宝典", path: "/interview" },
  { name: "小工具", path: "/tools" },
  { name: "博客", path: "/blog" },
  { name: "简历制作", path: "/resume" },
];

const HeaderPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = React.useState(navItems[0].path);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setActivePath(path);
  };

  const goHome = () => {
    navigate(navItems[0].path);
    setActivePath(navItems[0].path);
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <div>个人信息</div>,
      icon: <UserOutlined />,
    },
    {
      key: "member-info",
      label: <div>会员信息</div>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: <div onClick={handleLogout}>退出登录</div>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className="sticky z-50 w-full top-0 left-0 right-0 h-[80px] px-8 flex justify-between items-center p-4 bg-slate-900">
      <div
        className="flex items-center justify-center gap-2 text-2xl font-bold cursor-pointer"
        onClick={goHome}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-700 font-bold text-lg">
          FE
        </div>
        <span>前端面试宝典</span>
      </div>
      <div className="flex items-center justify-between gap-6">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`text-lg cursor-pointer hover:text-violet-700 relative group ${
              activePath === item.path ? "text-violet-700 font-bold" : ""
            }`}
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-700 transition-all group-hover:w-full" />
          </div>
        ))}
      </div>
      <div className="text-lg cursor-pointer hover:text-slate-300">
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <a onClick={(e) => e.preventDefault()}>
            <Space className="cursor-pointer text-violet-700">
              Lucky
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderPage;
