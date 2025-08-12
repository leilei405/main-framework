"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Tabs,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import type { UploadProps } from "antd";

const { TabPane } = Tabs;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateUser(values);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = async (values: any) => {
    // TODO: 实现密码修改逻辑
    message.success("密码修改成功");
    setPasswordModalVisible(false);
  };

  const uploadProps: UploadProps = {
    name: "avatar",
    action: "/api/upload/avatar",
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只能上传 JPG/PNG 格式的图片!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === "done") {
        message.success("头像上传成功");
        // TODO: 更新用户头像
      }
    },
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Card title="个人中心">
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile">
            <div style={{ display: "flex", marginBottom: 24 }}>
              <div style={{ marginRight: 24 }}>
                <Avatar size={80} icon={<UserOutlined />} src={user?.avatar} />
                <div style={{ marginTop: 8 }}>
                  <Upload {...uploadProps}>
                    <Button size="small" icon={<UploadOutlined />}>
                      更换头像
                    </Button>
                  </Upload>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Form
                  layout="vertical"
                  initialValues={user}
                  onFinish={onFinish}
                  style={{ maxWidth: 400 }}
                >
                  <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: "请输入用户名!" }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: "请输入邮箱!" },
                      { type: "email", message: "请输入有效的邮箱地址!" },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[{ required: true, message: "请输入手机号!" }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存修改
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => setPasswordModalVisible(true)}
                    >
                      修改密码
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>

          <TabPane tab="我的发布" key="posts">
            <div>
              {/* TODO: 显示用户发布的物品信息 */}
              <p>暂无发布记录</p>
            </div>
          </TabPane>

          <TabPane tab="我的收藏" key="favorites">
            <div>
              {/* TODO: 显示用户收藏的信息 */}
              <p>暂无收藏记录</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form onFinish={onPasswordChange} layout="vertical">
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: "请输入当前密码!" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码!" },
              { min: 6, message: "密码至少6个字符!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
