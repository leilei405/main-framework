"use client"

import { Form, Select, Input, Button, Space, Card } from "antd"
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons"
import { CATEGORY_LABELS, STATUS_LABELS, TYPE_LABELS } from "@/types/item"
import type { ItemSearchParams } from "@/services/itemService"

const { Option } = Select

interface ItemFilterProps {
  onFilter: (params: ItemSearchParams) => void
  loading?: boolean
}

export default function ItemFilter({ onFilter, loading }: ItemFilterProps) {
  const [form] = Form.useForm()

  const handleSearch = (values: any) => {
    const params: ItemSearchParams = {}
    if (values.keyword) params.keyword = values.keyword
    if (values.type) params.type = values.type
    if (values.category) params.category = values.category
    if (values.status) params.status = values.status
    if (values.location) params.location = values.location

    onFilter(params)
  }

  const handleReset = () => {
    form.resetFields()
    onFilter({})
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={handleSearch} style={{ width: "100%" }}>
        <Form.Item name="keyword" style={{ minWidth: 200 }}>
          <Input placeholder="搜索关键词" />
        </Form.Item>

        <Form.Item name="type">
          <Select placeholder="选择类型" style={{ width: 120 }} allowClear>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="category">
          <Select placeholder="选择分类" style={{ width: 120 }} allowClear>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status">
          <Select placeholder="选择状态" style={{ width: 120 }} allowClear>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="location">
          <Input placeholder="地点" style={{ width: 150 }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
