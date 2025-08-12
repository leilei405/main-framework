import { useNavigate } from "react-router-dom";
import { Layout, Button, Avatar, Dropdown, Badge } from "antd";
import {
  HeartOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const HeaderPage = () => {
  const navigate = useNavigate();

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

  return (
    <Layout.Header className="header">
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
    </Layout.Header>
  );
};

export default HeaderPage;
