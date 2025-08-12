"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/services/adminService";
import type { AdminStats, UserManagement, Report } from "@/types/admin";
import {
  UserStatus,
  ReportStatus,
  USER_STATUS_LABELS,
  REPORT_TYPE_LABELS,
} from "@/types/admin";
import type { Item } from "@/types/item";
import type { MissingChild } from "@/types/missingChild";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [pendingChildren, setPendingChildren] = useState<MissingChild[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "user" | "item" | "child" | "report" | null
  >(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, itemsData, childrenData, reportsData] =
        await Promise.all([
          adminService.getStats(token!),
          adminService.getUsers(token!),
          adminService.getPendingItems(token!),
          adminService.getPendingMissingChildren(token!),
          adminService.getReports(token!, { status: ReportStatus.PENDING }),
        ]);

      setStats(statsData);
      setUsers(usersData.users);
      setPendingItems(itemsData);
      setPendingChildren(childrenData);
      setReports(reportsData.reports);
    } catch (error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (
    user: UserManagement,
    action: "ban" | "suspend" | "activate"
  ) => {
    setSelectedRecord(user);
    setModalType("user");
    setModalVisible(true);
    form.setFieldsValue({ action });
  };

  const handleItemAction = (item: Item, action: "approve" | "reject") => {
    setSelectedRecord({ ...item, action });
    setModalType("item");
    setModalVisible(true);
  };

  const handleChildAction = (
    child: MissingChild,
    action: "approve" | "reject"
  ) => {
    setSelectedRecord({ ...child, action });
    setModalType("child");
    setModalVisible(true);
  };

  const handleReportAction = (
    report: Report,
    action: "resolve" | "dismiss"
  ) => {
    setSelectedRecord({ ...report, action });
    setModalType("report");
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (modalType === "user") {
        const statusMap = {
          ban: UserStatus.BANNED,
          suspend: UserStatus.SUSPENDED,
          activate: UserStatus.ACTIVE,
        };
        await adminService.updateUserStatus(
          token!,
          selectedRecord.id,
          statusMap[values.action],
          values.reason
        );
        message.success("用户状态已更新");
      } else if (modalType === "item") {
        if (selectedRecord.action === "approve") {
          await adminService.approveItem(token!, selectedRecord.id);
          message.success("物品已审核通过");
        } else {
          await adminService.rejectItem(
            token!,
            selectedRecord.id,
            values.reason
          );
          message.success("物品已拒绝");
        }
      } else if (modalType === "child") {
        if (selectedRecord.action === "approve") {
          await adminService.approveMissingChild(token!, selectedRecord.id);
          message.success("失踪儿童信息已审核通过");
        } else {
          await adminService.rejectMissingChild(
            token!,
            selectedRecord.id,
            values.reason
          );
          message.success("失踪儿童信息已拒绝");
        }
      } else if (modalType === "report") {
        if (selectedRecord.action === "resolve") {
          await adminService.resolveReport(
            token!,
            selectedRecord.id,
            values.resolution
          );
          message.success("举报已处理");
        } else {
          await adminService.dismissReport(
            token!,
            selectedRecord.id,
            values.reason
          );
          message.success("举报已驳回");
        }
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error("操作失败");
    }
  };

  const userColumns: ColumnsType<UserManagement> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => {
        const colors = {
          [UserStatus.ACTIVE]: "green",
          [UserStatus.INACTIVE]: "orange",
          [UserStatus.BANNED]: "red",
          [UserStatus.SUSPENDED]: "volcano",
        };
        return <Tag color={colors[status]}>{USER_STATUS_LABELS[status]}</Tag>;
      },
    },
    {
      title: "发布数量",
      dataIndex: "itemsCount",
      key: "itemsCount",
    },
    {
      title: "注册时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          {record.status === UserStatus.ACTIVE && (
            <>
              <Button
                size="small"
                onClick={() => handleUserAction(record, "suspend")}
              >
                暂停
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleUserAction(record, "ban")}
              >
                封禁
              </Button>
            </>
          )}
          {record.status !== UserStatus.ACTIVE && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleUserAction(record, "activate")}
            >
              激活
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const itemColumns: ColumnsType<Item> = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag>{type === "lost" ? "丢失" : "找到"}</Tag>,
    },
    {
      title: "发布者",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleItemAction(record, "approve")}
          >
            通过
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleItemAction(record, "reject")}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  const childColumns: ColumnsType<MissingChild> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      render: (age: number) => `${age}岁`,
    },
    {
      title: "报告人",
      dataIndex: ["reporterInfo", "name"],
      key: "reporterName",
    },
    {
      title: "关系",
      dataIndex: ["reporterInfo", "relationship"],
      key: "relationship",
    },
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleChildAction(record, "approve")}
          >
            通过
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleChildAction(record, "reject")}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  const reportColumns: ColumnsType<Report> = [
    {
      title: "举报类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag>{REPORT_TYPE_LABELS[type as keyof typeof REPORT_TYPE_LABELS]}</Tag>
      ),
    },
    {
      title: "举报对象",
      dataIndex: "targetType",
      key: "targetType",
      render: (type: string) => {
        const labels = {
          item: "物品",
          missing_child: "失踪儿童",
          user: "用户",
        };
        return labels[type as keyof typeof labels];
      },
    },
    {
      title: "举报人",
      dataIndex: "reporterName",
      key: "reporterName",
    },
    {
      title: "举报原因",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "举报时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => handleReportAction(record, "resolve")}
          >
            处理
          </Button>
          <Button
            size="small"
            onClick={() => handleReportAction(record, "dismiss")}
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats?.users.total || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: 8, fontSize: "12px", color: "#999" }}>
              今日新增: {stats?.users.newToday || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="物品信息"
              value={stats?.items.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 8, fontSize: "12px", color: "#999" }}>
              待审核: {stats?.items.pending || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="失踪儿童"
              value={stats?.missingChildren.total || 0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
            <div style={{ marginTop: 8, fontSize: "12px", color: "#999" }}>
              待审核: {stats?.missingChildren.pending || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="举报处理"
              value={stats?.reports.total || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: 8, fontSize: "12px", color: "#999" }}>
              待处理: {stats?.reports.pending || 0}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 管理面板 */}
      <Card>
        <Tabs defaultActiveKey="users">
          <TabPane tab="用户管理" key="users">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
          <TabPane tab={`物品审核 (${pendingItems.length})`} key="items">
            <Table
              columns={itemColumns}
              dataSource={pendingItems}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
          <TabPane tab={`儿童审核 (${pendingChildren.length})`} key="children">
            <Table
              columns={childColumns}
              dataSource={pendingChildren}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
          <TabPane tab={`举报处理 (${reports.length})`} key="reports">
            <Table
              columns={reportColumns}
              dataSource={reports}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 操作模态框 */}
      <Modal
        title={
          modalType === "user"
            ? "用户管理"
            : modalType === "item"
            ? "物品审核"
            : modalType === "child"
            ? "儿童信息审核"
            : "举报处理"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {modalType === "user" && (
            <>
              <Form.Item
                label="操作"
                name="action"
                rules={[{ required: true }]}
              >
                <Select placeholder="选择操作">
                  <Option value="activate">激活用户</Option>
                  <Option value="suspend">暂停用户</Option>
                  <Option value="ban">封禁用户</Option>
                </Select>
              </Form.Item>
              <Form.Item label="原因" name="reason">
                <TextArea rows={3} placeholder="请输入操作原因" />
              </Form.Item>
            </>
          )}

          {modalType === "item" && selectedRecord?.action === "reject" && (
            <Form.Item
              label="拒绝原因"
              name="reason"
              rules={[{ required: true, message: "请输入拒绝原因!" }]}
            >
              <TextArea rows={3} placeholder="请输入拒绝原因" />
            </Form.Item>
          )}

          {modalType === "child" && selectedRecord?.action === "reject" && (
            <Form.Item
              label="拒绝原因"
              name="reason"
              rules={[{ required: true, message: "请输入拒绝原因!" }]}
            >
              <TextArea rows={3} placeholder="请输入拒绝原因" />
            </Form.Item>
          )}

          {modalType === "report" && (
            <>
              {selectedRecord?.action === "resolve" ? (
                <Form.Item
                  label="处理结果"
                  name="resolution"
                  rules={[{ required: true, message: "请输入处理结果!" }]}
                >
                  <TextArea rows={3} placeholder="请描述处理结果" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="驳回原因"
                  name="reason"
                  rules={[{ required: true, message: "请输入驳回原因!" }]}
                >
                  <TextArea rows={3} placeholder="请输入驳回原因" />
                </Form.Item>
              )}
            </>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
