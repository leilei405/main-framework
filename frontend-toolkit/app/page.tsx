"use client"

import { useState } from "react"
import { Layout, Menu, Typography, Card } from "antd"
import {
  CodeOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  ToolOutlined,
  HomeOutlined,
  FormatPainterOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import JsonParser from "@/components/json-parser"
import TimestampConverter from "@/components/timestamp-converter"
import JsonToTs from "@/components/json-to-ts"
import UrlEncoder from "@/components/url-encoder"
import Base64Converter from "@/components/base64-converter"

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "首页",
  },
  {
    key: "json-parser",
    icon: <CodeOutlined />,
    label: "JSON 解析",
  },
  {
    key: "timestamp-converter",
    icon: <ClockCircleOutlined />,
    label: "时间戳转换",
  },
  {
    key: "json-to-ts",
    icon: <SwapOutlined />,
    label: "JSON转TS类型",
  },
  {
    key: "url-encoder",
    icon: <FormatPainterOutlined />,
    label: "URL编码解码",
  },
  {
    key: "base64-converter",
    icon: <ToolOutlined />,
    label: "Base64转换",
  },
]

export default function Home() {
  const [selectedTool, setSelectedTool] = useState("home")
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedTool(e.key)
  }

  const renderContent = () => {
    switch (selectedTool) {
      case "home":
        return (
          <div className="p-6">
            <div className="mb-8">
              <Title level={1} className="text-foreground">
                前端开发工具集
              </Title>
              <Text className="text-muted-foreground text-lg">为前端开发者精心打造的实用工具集合，提高开发效率</Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(1).map((item) => (
                <Card
                  key={item?.key}
                  hoverable
                  className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTool(item?.key as string)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl text-accent">{item?.icon}</div>
                    <div>
                      <Title level={4} className="text-card-foreground mb-1">
                        {item?.label}
                      </Title>
                      <Text className="text-muted-foreground">{getToolDescription(item?.key as string)}</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      case "json-parser":
        return <JsonParser />
      case "timestamp-converter":
        return <TimestampConverter />
      case "json-to-ts":
        return <JsonToTs />
      case "url-encoder":
        return <UrlEncoder />
      case "base64-converter":
        return <Base64Converter />
      default:
        return (
          <div className="p-6">
            <Title level={2} className="text-foreground">
              欢迎使用前端工具集
            </Title>
          </div>
        )
    }
  }

  const getToolDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      "json-parser": "格式化和验证JSON数据",
      "timestamp-converter": "时间戳与日期格式互转",
      "json-to-ts": "将JSON转换为TypeScript类型定义",
      "url-encoder": "URL编码和解码处理",
      "base64-converter": "Base64编码解码转换",
    }
    return descriptions[key] || ""
  }

  return (
    <Layout className="min-h-screen bg-background">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="bg-sidebar border-r border-sidebar-border"
        theme="light"
      >
        <div className="p-4">
          <Title level={4} className={`text-sidebar-foreground mb-0 ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "FT" : "前端工具"}
          </Title>
        </div>
        <Menu
          theme="light"
          selectedKeys={[selectedTool]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          className="bg-sidebar border-none"
        />
      </Sider>

      <Layout>
        <Header className="bg-background border-b border-border px-6 flex items-center">
          <Title level={3} className="text-foreground mb-0">
            {items.find((item) => item?.key === selectedTool)?.label || "前端开发工具集"}
          </Title>
        </Header>

        <Content className="bg-background">{renderContent()}</Content>
      </Layout>
    </Layout>
  )
}
