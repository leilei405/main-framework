"use client";

import { Card, Row, Col, Statistic, Button, Typography } from "antd";
import {
  FileTextOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <Title level={1} style={{ textAlign: "center", marginBottom: 16 }}>
          失物招领平台
        </Title>
        <Paragraph
          style={{ textAlign: "center", fontSize: 16, marginBottom: 32 }}
        >
          帮助每一个失物找到归宿，让每一份爱心都有回应
        </Paragraph>

        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/items")}
            >
              发布招领信息
            </Button>
          </Col>
          <Col>
            <Button
              size="large"
              icon={<SearchOutlined />}
              onClick={() => navigate("/search")}
            >
              搜索失物
            </Button>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 48 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="物品招领"
              value={1234}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="失踪儿童"
              value={56}
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="成功匹配"
              value={892}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card
            title="最新招领信息"
            extra={<Button type="link">查看更多</Button>}
          >
            <div className="recent-items">
              {/* TODO: 显示最新的招领信息列表 */}
              <p>暂无数据</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="成功案例" extra={<Button type="link">查看更多</Button>}>
            <div className="success-cases">
              {/* TODO: 显示成功匹配的案例 */}
              <p>暂无数据</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
