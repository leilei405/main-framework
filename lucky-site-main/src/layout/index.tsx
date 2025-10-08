import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import HeaderPage from "../pages/Header";
import ParticleBackground from "../components/ParticleBackground";

const LayoutPage: React.FC = () => {
  return (
    <Layout>
      <HeaderPage />
      <ParticleBackground />
      <Layout.Content className="h-[calc(100vh-80px)]">
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default LayoutPage;
