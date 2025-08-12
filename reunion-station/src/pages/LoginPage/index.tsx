"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import "./index.css";

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const success = await login({
        username: values.username,
        password: values.password,
      });

      if (success) {
        navigate(from, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          登录失物招领平台
        </Title>

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名/邮箱/手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="/forgot-password">忘记密码？</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>或</Divider>

        <div style={{ textAlign: "center" }}>
          <span>还没有账号？</span>
          <Link to="/register">立即注册</Link>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f0f2f5",
            borderRadius: 6,
            fontSize: 12,
          }}
        >
          <div>测试账号：</div>
          <div>用户名：admin，密码：admin</div>
        </div>
      </Card>
    </div>
  );
}
