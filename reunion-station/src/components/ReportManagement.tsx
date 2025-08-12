"use client"

import { useState, useEffect } from "react"
import { Table, Button, Tag, Space, Modal, Form, Input, message, Card } from "antd"
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/adminService"
import type { Report } from "@/types/admin"
import { ReportStatus, REPORT_STATUS_LABELS, REPORT_TYPE_LABELS } from "@/types/admin"

const { TextArea } = Input

export default function ReportManagement() {
  const { token } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [actionType, setActionType] = useState<"resolve" | "dismiss" | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const result = await adminService.getReports(token!)
      setReports(result.reports)
    } catch (error) {
      message.error("加载举报列表失败")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (report: Report, action: "resolve" | "dismiss") => {
    setSelectedReport(report)
    setActionType(action)
    setModalVisible(true)
    form.resetFields()
  }

  const handleSubmit = async (values: any) => {
    if (!selectedReport || !actionType) return

    try {
      if (actionType === "resolve") {
        await adminService.resolveReport(token!, selectedReport.id, values.resolution)
        message.success("举报已处理")
      } else {
        await adminService.dismissReport(token!, selectedReport.id, values.reason)
        message.success("举报已驳回")
      }

      setModalVisible(false)
      loadReports()
    } catch (error) {
      message.error("操作失败")
    }
  }

  const columns: ColumnsType<Report> = [
    {
      title: "举报类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag>{REPORT_TYPE_LABELS[type as keyof typeof REPORT_TYPE_LABELS]}</Tag>,
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
        }
        return labels[type as keyof typeof labels]
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
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: ReportStatus) => {
        const colors = {
          [ReportStatus.PENDING]: "orange",
          [ReportStatus.INVESTIGATING]: "blue",
          [ReportStatus.RESOLVED]: "green",
          [ReportStatus.DISMISSED]: "gray",
        }
        return <Tag color={colors[status]}>{REPORT_STATUS_LABELS[status]}</Tag>
      },
    },
    {
      title: "举报时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}>
            查看详情
          </Button>
          {record.status === ReportStatus.PENDING && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAction(record, "resolve")}
              >
                处理
              </Button>
              <Button size="small" icon={<CloseOutlined />} onClick={() => handleAction(record, "dismiss")}>
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card title="举报管理">
      <Table columns={columns} dataSource={reports} rowKey="id" loading={loading} />

      <Modal
        title={actionType === "resolve" ? "处理举报" : "驳回举报"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {actionType === "resolve" ? (
            <Form.Item label="处理结果" name="resolution" rules={[{ required: true, message: "请输入处理结果!" }]}>
              <TextArea rows={4} placeholder="请详细描述处理结果和采取的措施" />
            </Form.Item>
          ) : (
            <Form.Item label="驳回原因" name="reason" rules={[{ required: true, message: "请输入驳回原因!" }]}>
              <TextArea rows={4} placeholder="请说明驳回的原因" />
            </Form.Item>
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
    </Card>
  )
}
