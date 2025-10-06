import React from "react";
import { Layout as AntLayout, Menu, Button } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  ToolOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./layout.module.less";

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  activeInterview?: number;
  onInterviewChange?: (id: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeInterview = 1,
  onInterviewChange,
}) => {
  // 模拟数据
  const interviewCategories = [
    { id: 1, name: "HTML/CSS" },
    { id: 2, name: "JavaScript基础" },
    { id: 3, name: "JavaScript高级" },
    { id: 4, name: "React" },
    { id: 5, name: "Vue" },
    { id: 6, name: "Node.js" },
    { id: 7, name: "Webpack" },
    { id: 8, name: "性能优化" },
    { id: 9, name: "设计模式" },
    { id: 10, name: "网络" },
  ];

  // 渲染布局
  return (
    <div className={styles.appContainer}>
      <Header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            <HomeOutlined style={{ marginRight: 5 }} /> 首页
          </Link>
          <Link to="/interview" className={styles.navLink}>
            <BookOutlined style={{ marginRight: 5 }} /> 前端面试宝典
          </Link>
          <Link to="/tools" className={styles.navLink}>
            <ToolOutlined style={{ marginRight: 5 }} /> 小工具
          </Link>
          <Link to="/blog" className={styles.navLink}>
            <EditOutlined style={{ marginRight: 5 }} /> 博客
          </Link>
        </nav>
        <Button
          type="primary"
          icon={<UserOutlined />}
          className={styles.loginButton}
        >
          登录
        </Button>
      </Header>

      <div className={styles.mainContent}>
        <Sider width={240} className={styles.sidebar} theme="light">
          <div className={styles.sidebarHeader}>面试题目导航</div>
          <Menu
            mode="inline"
            selectedKeys={[activeInterview.toString()]}
            onSelect={({ key }) =>
              onInterviewChange && onInterviewChange(Number(key))
            }
            style={{ borderRight: 0 }}
          >
            {interviewCategories.map((category) => (
              <Menu.Item
                key={category.id.toString()}
                className={`${styles.sidebarItem} ${
                  activeInterview === category.id ? styles.active : ""
                }`}
              >
                {category.name}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Content className={styles.content}>{children}</Content>

        <div className={styles.toolbar}>
          {[1, 2, 3, 4].map((toolId) => (
            <div key={toolId} className={styles.toolItem}>
              {toolId}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
