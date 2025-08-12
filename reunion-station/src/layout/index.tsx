"use client";

import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout as AntLayout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  FileTextOutlined,
  HeartOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "首页",
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: "搜索",
    },
    {
      key: "/items",
      icon: <FileTextOutlined />,
      label: "物品招领",
    },
    {
      key: "/missing-children",
      icon: <HeartOutlined />,
      label: "失踪儿童",
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: () => {
        // TODO: 实现退出登录逻辑
        navigate("/login");
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="header-content">
          <div className="logo">
            <HeartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <span className="logo-text">失物招领</span>
          </div>

          <div className="header-actions">
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                size="large"
                className="notification-btn"
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                size="default"
                icon={<UserOutlined />}
                className="user-avatar"
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        </div>
      </Header>

      <AntLayout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={200}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>

        <AntLayout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
