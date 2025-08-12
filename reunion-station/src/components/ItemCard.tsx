"use client"

import { Card, Tag, Button, Space, Image, Typography } from "antd"
import { EyeOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons"
import type { Item } from "@/types/item"
import { ItemType, CATEGORY_LABELS, TYPE_LABELS } from "@/types/item"

const { Text, Paragraph } = Typography

interface ItemCardProps {
  item: Item
  onView: (item: Item) => void
  onContact?: (item: Item) => void
}

export default function ItemCard({ item, onView, onContact }: ItemCardProps) {
  return (
    <Card
      hoverable
      cover={
        item.images.length > 0 ? (
          <Image
            alt={item.title}
            src={item.images[0] || "/placeholder.svg"}
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
            暂无图片
          </div>
        )
      }
      actions={[
        <Button key="view" type="link" icon={<EyeOutlined />} onClick={() => onView(item)}>
          查看详情
        </Button>,
        <Button key="contact" type="link" icon={<PhoneOutlined />} onClick={() => onContact?.(item)}>
          联系TA
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{item.title}</span>
            <Tag color={item.type === ItemType.LOST ? "red" : "green"}>{TYPE_LABELS[item.type]}</Tag>
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
              {item.description}
            </Paragraph>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <EnvironmentOutlined style={{ marginRight: 4, color: "#999" }} />
                <Text type="secondary" ellipsis>
                  {item.location.address}
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ClockCircleOutlined style={{ marginRight: 4, color: "#999" }} />
                <Text type="secondary">{new Date(item.createdAt).toLocaleDateString()}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tag>{CATEGORY_LABELS[item.category]}</Tag>
                {item.reward && (
                  <Text strong style={{ color: "#f5222d" }}>
                    悬赏 ¥{item.reward}
                  </Text>
                )}
              </div>
            </Space>
          </div>
        }
      />
    </Card>
  )
}
