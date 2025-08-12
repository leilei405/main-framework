"use client"

import { Card, Tag, Button, Space, Image, Typography, Alert } from "antd"
import {
  EyeOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import type { MissingChild } from "@/types/missingChild"
import { MissingChildPriority, PRIORITY_LABELS } from "@/types/missingChild"

const { Text, Paragraph } = Typography

interface MissingChildCardProps {
  child: MissingChild
  onView: (child: MissingChild) => void
  onProvideTip: (child: MissingChild) => void
}

export default function MissingChildCard({ child, onView, onProvideTip }: MissingChildCardProps) {
  const isUrgent = child.priority === MissingChildPriority.URGENT
  const daysSinceMissing = dayjs().diff(dayjs(child.lastSeenTime), "day")

  return (
    <Card
      hoverable
      cover={
        child.images.length > 0 ? (
          <Image
            alt={child.name}
            src={child.images[0] || "/placeholder.svg"}
            height={200}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        ) : (
          <div
            style={{
              height: 200,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            暂无照片
          </div>
        )
      }
      actions={[
        <Button key="view" type="link" icon={<EyeOutlined />} onClick={() => onView(child)}>
          查看详情
        </Button>,
        <Button key="tip" type="link" icon={<PhoneOutlined />} onClick={() => onProvideTip(child)}>
          提供线索
        </Button>,
      ]}
    >
      {isUrgent && (
        <Alert message="紧急寻人" type="error" icon={<WarningOutlined />} style={{ marginBottom: 12 }} showIcon />
      )}

      <Card.Meta
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>{child.name}</span>
            <Tag color="red">{PRIORITY_LABELS[child.priority]}</Tag>
          </div>
        }
        description={
          <div>
            <Space size="large" style={{ marginBottom: 8 }}>
              <Text>{child.age}岁</Text>
              <Text>{child.gender === "male" ? "男" : "女"}</Text>
              <Text type="danger">{daysSinceMissing}天前失踪</Text>
            </Space>

            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
              {child.description}
            </Paragraph>

            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <EnvironmentOutlined style={{ marginRight: 4, color: "#999" }} />
                <Text type="secondary" ellipsis>
                  {child.lastSeenLocation.address}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ClockCircleOutlined style={{ marginRight: 4, color: "#999" }} />
                <Text type="secondary">{dayjs(child.lastSeenTime).format("MM-DD HH:mm")}</Text>
              </div>
            </Space>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <Button type="primary" danger size="small" href="tel:110">
                紧急报警：110
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  )
}
