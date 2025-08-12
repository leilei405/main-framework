"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Row,
  Col,
  Tabs,
  Image,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { itemService } from "@/services/itemService";
import type { Item, CreateItemData } from "@/types/item";
import {
  ItemType,
  type ItemCategory,
  ItemStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/types/item";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
const { Title } = Typography;
const { TabPane } = Tabs;

export default function ItemsPage() {
  const { user, token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [form] = Form.useForm();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const result = await itemService.getItems();
      setItems(result.items);
    } catch (error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setUploadedImages([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setUploadedImages(item.images);
    form.setFieldsValue({
      ...item,
      location: item.location.address,
      contactName: item.contactInfo.name,
      contactPhone: item.contactInfo.phone,
      contactEmail: item.contactInfo.email,
      contactWechat: item.contactInfo.wechat,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await itemService.deleteItem(token!, id);
      message.success("删除成功");
      loadItems();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleView = (item: Item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const itemData: CreateItemData = {
        title: values.title,
        description: values.description,
        category: values.category,
        type: values.type,
        images: uploadedImages,
        location: {
          province: "广东省", // TODO: 实际应该从地址选择器获取
          city: "深圳市",
          district: "南山区",
          address: values.location,
        },
        contactInfo: {
          name: values.contactName,
          phone: values.contactPhone,
          email: values.contactEmail,
          wechat: values.contactWechat,
        },
        reward: values.reward,
        tags: values.tags
          ? values.tags.split(",").map((tag: string) => tag.trim())
          : [],
      };

      if (editingItem) {
        await itemService.updateItem(token!, editingItem.id, itemData);
        message.success("更新成功");
      } else {
        await itemService.createItem(token!, itemData);
        message.success("发布成功");
      }

      setModalVisible(false);
      loadItems();
    } catch (error) {
      message.error("操作失败");
    }
  };

  const uploadProps: UploadProps = {
    name: "images",
    multiple: true,
    accept: "image/*",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("只能上传图片文件!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("图片大小不能超过 5MB!");
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: async (info) => {
      if (info.fileList.length > 0) {
        try {
          const files = info.fileList
            .map((file) => file.originFileObj)
            .filter(Boolean) as File[];
          const urls = await itemService.uploadImages(files);
          setUploadedImages([...uploadedImages, ...urls]);
          message.success("图片上传成功");
        } catch (error) {
          message.error("图片上传失败");
        }
      }
    },
  };

  const columns: ColumnsType<Item> = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: ItemType) => (
        <Tag color={type === ItemType.LOST ? "red" : "green"}>
          {TYPE_LABELS[type]}
        </Tag>
      ),
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: ItemCategory) => CATEGORY_LABELS[category],
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: ItemStatus) => {
        const colors = {
          [ItemStatus.ACTIVE]: "blue",
          [ItemStatus.MATCHED]: "green",
          [ItemStatus.CLOSED]: "gray",
          [ItemStatus.EXPIRED]: "red",
        };
        return <Tag color={colors[status]}>{STATUS_LABELS[status]}</Tag>;
      },
    },
    {
      title: "地点",
      dataIndex: ["location", "address"],
      key: "location",
      width: 200,
      ellipsis: true,
    },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {record.userId === user?.id && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定删除吗？"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="物品招领管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            发布信息
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={items}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 发布/编辑模态框 */}
      <Modal
        title={editingItem ? "编辑信息" : "发布信息"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: "请选择类型!" }]}
              >
                <Select placeholder="选择类型">
                  <Option value={ItemType.LOST}>丢失物品</Option>
                  <Option value={ItemType.FOUND}>捡到物品</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="分类"
                name="category"
                rules={[{ required: true, message: "请选择分类!" }]}
              >
                <Select placeholder="选择分类">
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题!" }]}
          >
            <Input placeholder="简要描述物品" />
          </Form.Item>

          <Form.Item
            label="详细描述"
            name="description"
            rules={[{ required: true, message: "请输入描述!" }]}
          >
            <TextArea
              rows={4}
              placeholder="详细描述物品特征、丢失/发现经过等"
            />
          </Form.Item>

          <Form.Item
            label="地点"
            name="location"
            rules={[{ required: true, message: "请输入地点!" }]}
          >
            <Input placeholder="丢失或发现的具体地点" />
          </Form.Item>

          <Form.Item label="悬赏金额" name="reward">
            <Input
              type="number"
              placeholder="可选，设置悬赏金额"
              addonAfter="元"
            />
          </Form.Item>

          <Form.Item label="标签" name="tags">
            <Input placeholder="用逗号分隔多个标签，如：红色,苹果手机,有保护壳" />
          </Form.Item>

          <Form.Item label="图片">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持单个或批量上传，最多5张图片</p>
            </Dragger>
            {uploadedImages.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Image.PreviewGroup>
                  {uploadedImages.map((url, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={url || "/placeholder.svg"}
                      style={{ marginRight: 8 }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            )}
          </Form.Item>

          <Title level={5}>联系方式</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="contactName"
                rules={[{ required: true, message: "请输入联系人!" }]}
              >
                <Input placeholder="联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="contactPhone"
                rules={[{ required: true, message: "请输入联系电话!" }]}
              >
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="邮箱" name="contactEmail">
                <Input placeholder="联系邮箱（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="微信" name="contactWechat">
                <Input placeholder="微信号（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? "更新" : "发布"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="物品详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedItem && (
          <div>
            <Row gutter={16}>
              <Col span={16}>
                <Title level={4}>{selectedItem.title}</Title>
                <Space size="large" style={{ marginBottom: 16 }}>
                  <Tag
                    color={
                      selectedItem.type === ItemType.LOST ? "red" : "green"
                    }
                  >
                    {TYPE_LABELS[selectedItem.type]}
                  </Tag>
                  <Tag>{CATEGORY_LABELS[selectedItem.category]}</Tag>
                  <Tag color="blue">{STATUS_LABELS[selectedItem.status]}</Tag>
                </Space>
                <p style={{ marginBottom: 16 }}>{selectedItem.description}</p>
                <p>
                  <strong>地点：</strong>
                  {selectedItem.location.address}
                </p>
                <p>
                  <strong>发布时间：</strong>
                  {new Date(selectedItem.createdAt).toLocaleString()}
                </p>
                {selectedItem.reward && (
                  <p>
                    <strong>悬赏：</strong>
                    <span
                      style={{
                        color: "#f5222d",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      ¥{selectedItem.reward}
                    </span>
                  </p>
                )}
                {selectedItem.tags.length > 0 && (
                  <div>
                    <strong>标签：</strong>
                    {selectedItem.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </Col>
              <Col span={8}>
                <Card title="联系方式" size="small">
                  <p>
                    <strong>联系人：</strong>
                    {selectedItem.contactInfo.name}
                  </p>
                  <p>
                    <strong>电话：</strong>
                    {selectedItem.contactInfo.phone}
                  </p>
                  {selectedItem.contactInfo.email && (
                    <p>
                      <strong>邮箱：</strong>
                      {selectedItem.contactInfo.email}
                    </p>
                  )}
                  {selectedItem.contactInfo.wechat && (
                    <p>
                      <strong>微信：</strong>
                      {selectedItem.contactInfo.wechat}
                    </p>
                  )}
                </Card>
              </Col>
            </Row>
            {selectedItem.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>图片</Title>
                <Image.PreviewGroup>
                  {selectedItem.images.map((url, index) => (
                    <Image
                      key={index}
                      width={150}
                      height={150}
                      src={url || "/placeholder.svg"}
                      style={{ marginRight: 8 }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
