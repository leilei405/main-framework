import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import HeaderPage from "../pages/Header";

const LayoutPage: React.FC = () => {
  return (
    <Layout>
      <HeaderPage />
      <Layout.Content className="h-[calc(100vh-80px)]">
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default LayoutPage;
