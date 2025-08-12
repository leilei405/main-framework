import { Layout } from "antd";

const FooterPage = () => {
  return (
    <Layout.Footer style={{ textAlign: "center" }}>
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Layout.Footer>
  );
};

export default FooterPage;
