import { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  PieChartOutlined,
  ClockCircleOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import JsonParser from "./components/JsonParser";
import TimestampConverter from "./components/TimestampConverter";
import JsonToTsConverter from "./components/JsonToTsConverter";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const [activeTool, setActiveTool] = useState<string>("json-parser");

  const renderActiveTool = () => {
    switch (activeTool) {
      case "json-parser":
        return <JsonParser />;
      case "timestamp-converter":
        return <TimestampConverter />;
      case "json-to-ts":
        return <JsonToTsConverter />;
      default:
        return <JsonParser />;
    }
  };

  const handleToolChange = (e: any) => {
    setActiveTool(e.key);
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <Title level={3} className="logo-text">
            前端工具集
          </Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[activeTool]}
            onClick={handleToolChange}
            className="tool-menu"
          >
            <Menu.Item key="json-parser" icon={<PieChartOutlined />}>
              JSON解析器
            </Menu.Item>
            <Menu.Item key="timestamp-converter" icon={<ClockCircleOutlined />}>
              时间戳转换
            </Menu.Item>
            <Menu.Item key="json-to-ts" icon={<CodeOutlined />}>
              JSON转TS类型
            </Menu.Item>
          </Menu>
        </div>
      </Header>

      <Content className="app-content">
        <div className="content-wrapper">{renderActiveTool()}</div>
      </Content>

      <Footer className="app-footer">
        <Paragraph className="footer-text">
          前端工具集 © 2023 Created by Developer
        </Paragraph>
      </Footer>
    </Layout>
  );
}

export default App;
