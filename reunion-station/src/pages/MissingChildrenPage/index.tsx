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
  DatePicker,
  InputNumber,
  Alert,
  Image,
  Typography,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  InboxOutlined,
  PhoneOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps } from "antd";
import dayjs from "dayjs";
import { useAuth } from "@/contexts/AuthContext";
import { missingChildService } from "@/services/missingChildService";
import type {
  MissingChild,
  CreateMissingChildData,
} from "@/types/missingChild";
import {
  MissingChildStatus,
  MissingChildPriority,
  PRIORITY_LABELS,
} from "@/types/missingChild";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function MissingChildrenPage() {
  const { user, token } = useAuth();
  const [children, setChildren] = useState<MissingChild[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [editingChild, setEditingChild] = useState<MissingChild | null>(null);
  const [selectedChild, setSelectedChild] = useState<MissingChild | null>(null);
  const [form] = Form.useForm();
  const [tipForm] = Form.useForm();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const result = await missingChildService.getMissingChildren({
        status: MissingChildStatus.APPROVED, // 只显示已审核通过的
      });
      setChildren(result.children);
    } catch (error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingChild(null);
    setUploadedImages([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = (child: MissingChild) => {
    setSelectedChild(child);
    setDetailModalVisible(true);
  };

  const handleSubmitTip = (child: MissingChild) => {
    setSelectedChild(child);
    tipForm.resetFields();
    setTipModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const childData: CreateMissingChildData = {
        name: values.name,
        age: values.age,
        gender: values.gender,
        description: values.description,
        physicalFeatures: {
          height: values.height,
          weight: values.weight,
          hairColor: values.hairColor,
          eyeColor: values.eyeColor,
          skinTone: values.skinTone,
          distinguishingMarks: values.distinguishingMarks,
        },
        clothing: {
          description: values.clothingDescription,
          colors: values.clothingColors
            ? values.clothingColors.split(",").map((c: string) => c.trim())
            : [],
        },
        lastSeenLocation: {
          province: values.province || "广东省",
          city: values.city || "深圳市",
          district: values.district || "南山区",
          address: values.address,
        },
        lastSeenTime: values.lastSeenTime.toISOString(),
        circumstances: values.circumstances,
        images: uploadedImages,
        reporterInfo: {
          name: values.reporterName,
          relationship: values.relationship,
          phone: values.reporterPhone,
          email: values.reporterEmail,
          idNumber: values.idNumber,
        },
        policeInfo: values.caseNumber
          ? {
              caseNumber: values.caseNumber,
              officerName: values.officerName,
              officerContact: values.officerContact,
              policeStation: values.policeStation,
            }
          : undefined,
      };

      await missingChildService.createMissingChild(token!, childData);
      message.success("信息已提交，等待审核");
      setModalVisible(false);
      loadChildren();
    } catch (error) {
      message.error("提交失败");
    }
  };

  const handleTipSubmit = async (values: any) => {
    try {
      await missingChildService.submitTip(selectedChild!.id, {
        content: values.content,
        location: values.location,
        reporterContact: values.reporterContact,
      });
      message.success("线索已提交，感谢您的帮助！");
      setTipModalVisible(false);
    } catch (error) {
      message.error("提交失败");
    }
  };

  const uploadProps: UploadProps = {
    name: "images",
    multiple: true,
    accept: "image/*",
    beforeUpload: () => false,
    onChange: async (info) => {
      if (info.fileList.length > 0) {
        try {
          const files = info.fileList
            .map((file) => file.originFileObj)
            .filter(Boolean) as File[];
          // TODO: 实际上传逻辑
          const mockUrls = files.map(
            (_, index) =>
              `/placeholder.svg?height=200&width=200&query=child-photo-${index}`
          );
          setUploadedImages([...uploadedImages, ...mockUrls]);
          message.success("图片上传成功");
        } catch (error) {
          message.error("图片上传失败");
        }
      }
    },
  };

  const columns: ColumnsType<MissingChild> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 80,
      render: (age: number) => `${age}岁`,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      width: 80,
      render: (gender: string) => (gender === "male" ? "男" : "女"),
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: MissingChildPriority) => {
        const colors = {
          [MissingChildPriority.LOW]: "default",
          [MissingChildPriority.MEDIUM]: "blue",
          [MissingChildPriority.HIGH]: "orange",
          [MissingChildPriority.URGENT]: "red",
        };
        return <Tag color={colors[priority]}>{PRIORITY_LABELS[priority]}</Tag>;
      },
    },
    {
      title: "最后出现地点",
      dataIndex: ["lastSeenLocation", "address"],
      key: "location",
      width: 200,
      ellipsis: true,
    },
    {
      title: "失踪时间",
      dataIndex: "lastSeenTime",
      key: "lastSeenTime",
      width: 120,
      render: (date: string) => dayjs(date).format("MM-DD HH:mm"),
    },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => dayjs(date).format("MM-DD"),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PhoneOutlined />}
            onClick={() => handleSubmitTip(record)}
          >
            提供线索
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Alert
        message="重要提醒"
        description="失踪儿童信息需要严格审核，请确保信息真实有效。如有紧急情况，请立即报警！"
        type="warning"
        icon={<WarningOutlined />}
        style={{ marginBottom: 16 }}
        action={
          <Button size="small" danger>
            报警电话：110
          </Button>
        }
      />

      <Card
        title="失踪儿童信息"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            发布信息
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={children}
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

      {/* 发布信息模态框 */}
      <Modal
        title="发布失踪儿童信息"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <Alert
          message="请注意"
          description="发布的信息将经过严格审核，请确保所有信息真实准确。虚假信息将承担法律责任。"
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: "请输入姓名!" }]}
                  >
                    <Input placeholder="失踪儿童姓名" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="年龄"
                    name="age"
                    rules={[{ required: true, message: "请输入年龄!" }]}
                  >
                    <InputNumber
                      min={0}
                      max={18}
                      placeholder="年龄"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{ required: true, message: "请选择性别!" }]}
                  >
                    <Select placeholder="选择性别">
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="详细描述"
                name="description"
                rules={[{ required: true, message: "请输入描述!" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="详细描述儿童的外貌特征、性格等"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="身高" name="height">
                    <Input placeholder="如：120cm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="体重" name="weight">
                    <Input placeholder="如：25kg" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="发色" name="hairColor">
                    <Input placeholder="如：黑色" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="眼色" name="eyeColor">
                    <Input placeholder="如：黑色" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="肤色" name="skinTone">
                    <Input placeholder="如：偏白" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="特殊标记" name="distinguishingMarks">
                <TextArea rows={2} placeholder="胎记、疤痕等特殊标记" />
              </Form.Item>
            </TabPane>

            <TabPane tab="失踪信息" key="missing">
              <Form.Item
                label="最后出现时间"
                name="lastSeenTime"
                rules={[{ required: true, message: "请选择时间!" }]}
              >
                <DatePicker
                  showTime
                  placeholder="选择最后出现时间"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="最后出现地点"
                name="address"
                rules={[{ required: true, message: "请输入地点!" }]}
              >
                <Input placeholder="详细地址" />
              </Form.Item>

              <Form.Item
                label="失踪经过"
                name="circumstances"
                rules={[{ required: true, message: "请描述经过!" }]}
              >
                <TextArea rows={4} placeholder="详细描述失踪经过和当时情况" />
              </Form.Item>

              <Form.Item label="当时穿着" name="clothingDescription">
                <TextArea rows={2} placeholder="描述失踪时的穿着" />
              </Form.Item>

              <Form.Item label="衣服颜色" name="clothingColors">
                <Input placeholder="用逗号分隔多个颜色，如：红色,蓝色" />
              </Form.Item>
            </TabPane>

            <TabPane tab="联系信息" key="contact">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="报告人姓名"
                    name="reporterName"
                    rules={[{ required: true, message: "请输入姓名!" }]}
                  >
                    <Input placeholder="报告人姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="与儿童关系"
                    name="relationship"
                    rules={[{ required: true, message: "请输入关系!" }]}
                  >
                    <Select placeholder="选择关系">
                      <Option value="父亲">父亲</Option>
                      <Option value="母亲">母亲</Option>
                      <Option value="爷爷">爷爷</Option>
                      <Option value="奶奶">奶奶</Option>
                      <Option value="其他亲属">其他亲属</Option>
                      <Option value="老师">老师</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="联系电话"
                    name="reporterPhone"
                    rules={[{ required: true, message: "请输入电话!" }]}
                  >
                    <Input placeholder="联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="邮箱" name="reporterEmail">
                    <Input placeholder="邮箱地址（可选）" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="身份证号"
                name="idNumber"
                rules={[{ required: true, message: "请输入身份证号!" }]}
              >
                <Input placeholder="报告人身份证号（用于身份验证）" />
              </Form.Item>
            </TabPane>

            <TabPane tab="警方信息" key="police">
              <Alert
                message="如已报警，请填写相关信息"
                type="info"
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="报案号" name="caseNumber">
                    <Input placeholder="警方报案号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="办案民警" name="officerName">
                    <Input placeholder="办案民警姓名" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="民警联系方式" name="officerContact">
                    <Input placeholder="民警联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="派出所" name="policeStation">
                    <Input placeholder="所属派出所" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="照片" key="photos">
              <Form.Item label="儿童照片">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">
                    请上传清晰的儿童照片，有助于寻找
                  </p>
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
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                提交审核
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        title="失踪儿童详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedChild && (
          <div>
            <Row gutter={24}>
              <Col span={16}>
                <Title level={4}>{selectedChild.name}</Title>
                <Space size="large" style={{ marginBottom: 16 }}>
                  <Tag>{selectedChild.age}岁</Tag>
                  <Tag>{selectedChild.gender === "male" ? "男" : "女"}</Tag>
                  <Tag color="red">
                    {PRIORITY_LABELS[selectedChild.priority]}
                  </Tag>
                </Space>
                <p style={{ marginBottom: 16 }}>{selectedChild.description}</p>
                <p>
                  <strong>最后出现时间：</strong>
                  {dayjs(selectedChild.lastSeenTime).format("YYYY-MM-DD HH:mm")}
                </p>
                <p>
                  <strong>最后出现地点：</strong>
                  {selectedChild.lastSeenLocation.address}
                </p>
                <p style={{ marginBottom: 16 }}>
                  <strong>失踪经过：</strong>
                  {selectedChild.circumstances}
                </p>
                {selectedChild.physicalFeatures.distinguishingMarks && (
                  <p>
                    <strong>特殊标记：</strong>
                    {selectedChild.physicalFeatures.distinguishingMarks}
                  </p>
                )}
              </Col>
              <Col span={8}>
                <Card
                  title="紧急联系"
                  size="small"
                  style={{ marginBottom: 16 }}
                >
                  <Button
                    type="primary"
                    danger
                    block
                    style={{ marginBottom: 8 }}
                  >
                    报警电话：110
                  </Button>
                  <Button
                    type="default"
                    block
                    onClick={() => handleSubmitTip(selectedChild)}
                  >
                    提供线索
                  </Button>
                </Card>
                <Card title="联系方式" size="small">
                  <p>
                    <strong>联系人：</strong>
                    {selectedChild.reporterInfo.name}
                  </p>
                  <p>
                    <strong>关系：</strong>
                    {selectedChild.reporterInfo.relationship}
                  </p>
                  <p>
                    <strong>电话：</strong>
                    <a href={`tel:${selectedChild.reporterInfo.phone}`}>
                      {selectedChild.reporterInfo.phone}
                    </a>
                  </p>
                </Card>
              </Col>
            </Row>
            {selectedChild.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>照片</Title>
                <Image.PreviewGroup>
                  {selectedChild.images.map((url, index) => (
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

      {/* 提供线索模态框 */}
      <Modal
        title="提供线索"
        open={tipModalVisible}
        onCancel={() => setTipModalVisible(false)}
        footer={null}
      >
        <Alert
          message="感谢您的帮助"
          description="任何线索都可能帮助找到失踪儿童，请提供您知道的任何相关信息。"
          type="info"
          style={{ marginBottom: 16 }}
        />
        <Form form={tipForm} layout="vertical" onFinish={handleTipSubmit}>
          <Form.Item
            label="线索内容"
            name="content"
            rules={[{ required: true, message: "请输入线索内容!" }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述您看到的情况或了解的信息"
            />
          </Form.Item>
          <Form.Item label="发现地点" name="location">
            <Input placeholder="如果有具体地点，请填写" />
          </Form.Item>
          <Form.Item label="您的联系方式" name="reporterContact">
            <Input placeholder="联系电话（可选，便于核实信息）" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交线索
              </Button>
              <Button onClick={() => setTipModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
