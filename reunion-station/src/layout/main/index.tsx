import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "antd";
import type { MenuProps, MenuTheme } from "antd";
import styles from "./index.module.scss";
// import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "sub1",
    label: "审核管理",
    children: [
      {
        key: "sub1-1",
        label: "物品审核",
      },
      {
        key: "sub1-2",
        label: "动物审核",
      },
    ],
  },
  {
    key: "sub2",
    label: "信息管理",
    children: [
      {
        key: "sub2-1",
        label: "物品信息",
      },
      {
        key: "sub2-2",
        label: "动物信息",
      },
    ],
  },
  {
    key: "sub4",
    label: "线索管理",
    children: [
      {
        key: "sub4-1",
        label: "线索发布",
      },
      {
        key: "sub4-2",
        label: "人物信息",
      },
      {
        key: "sub4-3",
        label: "物品信息",
      },
      {
        key: "sub4-4",
        label: "动物信息",
      },
    ],
  },
  {
    key: "sub3",
    label: "数据统计",
    children: [
      {
        key: "sub3-1",
        label: "物品统计",
      },
    ],
  },
  {
    key: "sub5",
    label: "系统管理",
    children: [
      {
        key: "sub5-1",
        label: "用户管理",
      },
      {
        key: "sub5-2",
        label: "角色管理",
      },
      {
        key: "sub5-3",
        label: "参数管理",
      },
      {
        key: "sub5-4",
        label: "日志管理",
      },
    ],
  },
];

const MainContentPage = () => {
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [current, setCurrent] = useState("1");

  const changeTheme = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Menu
          className={styles.menu}
          theme={theme}
          onClick={onClick}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainContentPage;
