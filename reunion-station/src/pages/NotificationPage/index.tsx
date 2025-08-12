"use client";

import { useState, useEffect } from "react";
import {
  Card,
  List,
  Badge,
  Button,
  Empty,
  Spin,
  Tabs,
  Switch,
  Form,
  Popconfirm,
} from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  SettingOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { Notification } from "@/types/notification";
import { useNotification } from "@/contexts/NotificationContext";

const { TabPane } = Tabs;

export default function NotificationPage() {
  const {
    notifications,
    unreadCount,
    settings,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
  } = useNotification();

  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconMap = {
      match: "🔗",
      message: "💬",
      system: "⚙️",
      audit: "👮",
      reminder: "⏰",
    };
    return iconMap[type] || "📢";
  };

  const getNotificationColor = (type: Notification["type"]) => {
    const colorMap = {
      match: "#52c41a",
      message: "#1890ff",
      system: "#faad14",
      audit: "#f5222d",
      reminder: "#722ed1",
    };
    return colorMap[type] || "#d9d9d9";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  const handleSettingsSubmit = async (values: any) => {
    await updateSettings(values);
  };

  const renderNotificationItem = (notification: Notification) => (
    <List.Item
      key={notification.id}
      className={`notification-item ${!notification.isRead ? "unread" : ""}`}
      actions={[
        !notification.isRead && (
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => markAsRead(notification.id)}
          >
            标记已读
          </Button>
        ),
        <Popconfirm
          key={`delete-${notification.id}`}
          title="确定要删除这条通知吗？"
          onConfirm={() => deleteNotification(notification.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" size="small" icon={<DeleteOutlined />} danger>
            删除
          </Button>
        </Popconfirm>,
      ].filter(Boolean)}
    >
      <List.Item.Meta
        avatar={
          <Badge dot={!notification.isRead}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: getNotificationColor(notification.type),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              {getNotificationIcon(notification.type)}
            </div>
          </Badge>
        }
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ fontWeight: !notification.isRead ? "bold" : "normal" }}
            >
              {notification.title}
            </span>
            <span style={{ fontSize: "12px", color: "#999" }}>
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        }
        description={notification.content}
      />
    </List.Item>
  );

  return (
    <div className="notification-page">
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BellOutlined />
            <span>通知中心</span>
            {unreadCount > 0 && (
              <Badge
                count={unreadCount}
                style={{ backgroundColor: "#f5222d" }}
              />
            )}
          </div>
        }
        extra={
          unreadCount > 0 && (
            <Button type="primary" onClick={markAllAsRead}>
              全部标记已读
            </Button>
          )
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`全部 (${notifications.length})`} key="all">
            <Spin spinning={loading}>
              {filteredNotifications.length > 0 ? (
                <List
                  dataSource={filteredNotifications}
                  renderItem={renderNotificationItem}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条通知`,
                  }}
                />
              ) : (
                <Empty description="暂无通知" />
              )}
            </Spin>
          </TabPane>

          <TabPane tab={`未读 (${unreadCount})`} key="unread">
            <Spin spinning={loading}>
              {filteredNotifications.length > 0 ? (
                <List
                  dataSource={filteredNotifications}
                  renderItem={renderNotificationItem}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条未读通知`,
                  }}
                />
              ) : (
                <Empty description="暂无未读通知" />
              )}
            </Spin>
          </TabPane>

          <TabPane tab="匹配通知" key="match">
            <Spin spinning={loading}>
              {filteredNotifications.length > 0 ? (
                <List
                  dataSource={filteredNotifications}
                  renderItem={renderNotificationItem}
                />
              ) : (
                <Empty description="暂无匹配通知" />
              )}
            </Spin>
          </TabPane>

          <TabPane tab="消息通知" key="message">
            <Spin spinning={loading}>
              {filteredNotifications.length > 0 ? (
                <List
                  dataSource={filteredNotifications}
                  renderItem={renderNotificationItem}
                />
              ) : (
                <Empty description="暂无消息通知" />
              )}
            </Spin>
          </TabPane>

          <TabPane
            tab={
              <>
                <SettingOutlined /> 设置
              </>
            }
            key="settings"
          >
            <Card title="通知设置" size="small">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSettingsSubmit}
                initialValues={settings || {}}
              >
                <Form.Item
                  name="emailNotifications"
                  label="邮件通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="pushNotifications"
                  label="推送通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="matchNotifications"
                  label="匹配通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="messageNotifications"
                  label="消息通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="systemNotifications"
                  label="系统通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="auditNotifications"
                  label="审核通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="reminderNotifications"
                  label="提醒通知"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
