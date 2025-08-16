import React from "react";
import { Layout } from "antd";
import HeaderPage from "./header";
import FooterPage from "./footer";
import MainContentPage from "./main";

const LayoutProvider: React.FC = () => {
  console.log("LayoutProvider");

  return (
    <Layout style={{ height: "100vh", backgroundColor: "#fff" }}>
      <HeaderPage />
      <MainContentPage />
      <FooterPage />
    </Layout>
  );
};

export default LayoutProvider;
