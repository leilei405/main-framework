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
  Popover,
  List,
  Typography,
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
import { useAuth } from "@/contexts/AuthContext";
// import { useNotification } from "@/contexts/NotificationContext";

const { Header, Content, Sider } = AntLayout;
const { Text } = Typography;

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  // const { notifications, unreadCount, markAsRead } = useNotification();

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
      onClick: logout,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const notificationContent = (
    <div style={{ width: 300, maxHeight: 400, overflow: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Text strong>通知</Text>
        <Button
          type="link"
          size="small"
          onClick={() => navigate("/notifications")}
        >
          查看全部
        </Button>
      </div>
      {/* {notifications.slice(0, 5).length > 0 ? (
        <List
          size="small"
          dataSource={notifications.slice(0, 5)}
          renderItem={(notification) => (
            <List.Item
              style={{ cursor: "pointer", padding: "8px 0" }}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification.id);
                }
                navigate("/notifications");
              }}
            >
              <List.Item.Meta
                title={
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: !notification.isRead ? "bold" : "normal",
                    }}
                  >
                    {notification.title}
                  </Text>
                }
                description={
                  <Text style={{ fontSize: "12px", color: "#666" }}>
                    {notification.content.length > 50
                      ? `${notification.content.substring(0, 50)}...`
                      : notification.content}
                  </Text>
                }
              />
              {!notification.isRead && <Badge status="processing" />}
            </List.Item>
          )}
        />
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
          暂无通知
        </div>
      )} */}
    </div>
  );

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="header-content">
          <div className="logo">
            <HeartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <span className="logo-text">失物招领</span>
          </div>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Popover
                  content={notificationContent}
                  title={null}
                  trigger="click"
                  placement="bottomRight"
                >
                  <Badge count={"unreadCount"} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      size="large"
                      className="notification-btn"
                    />
                  </Badge>
                </Popover>

                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <Avatar
                    size="default"
                    icon={<UserOutlined />}
                    src={user?.avatar}
                    className="user-avatar"
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </>
            ) : (
              <div>
                <Button type="text" onClick={() => navigate("/login")}>
                  登录
                </Button>
                <Button type="primary" onClick={() => navigate("/register")}>
                  注册
                </Button>
              </div>
            )}
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
}
