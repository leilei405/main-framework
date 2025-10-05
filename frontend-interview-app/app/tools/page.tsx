"use client"

import { Header } from "@/components/header"
import { Card } from "antd"
import {
  ToolOutlined,
  FileTextOutlined,
  BranchesOutlined,
  BgColorsOutlined,
  CodeOutlined,
  FileImageOutlined,
} from "@ant-design/icons"
import Link from "next/link"

export default function ToolsPage() {
  const tools = [
    {
      id: "json-formatter",
      name: "JSON 格式化",
      description: "美化和验证 JSON 数据",
      icon: <FileTextOutlined style={{ fontSize: 28 }} />,
      color: "from-blue-500 to-cyan-500",
      href: "/tools/json-formatter",
    },
    {
      id: "json-visualizer",
      name: "JSON 可视化",
      description: "将 JSON 转换为可视化依赖图",
      icon: <BranchesOutlined style={{ fontSize: 28 }} />,
      color: "from-purple-500 to-pink-500",
      href: "/tools/json-visualizer",
    },
    {
      id: "color-picker",
      name: "颜色选择器",
      description: "快速选择和转换颜色格式",
      icon: <BgColorsOutlined style={{ fontSize: 28 }} />,
      color: "from-orange-500 to-red-500",
      href: "/tools/color-picker",
    },
    {
      id: "code-formatter",
      name: "代码格式化",
      description: "格式化 HTML、CSS、JavaScript 代码",
      icon: <CodeOutlined style={{ fontSize: 28 }} />,
      color: "from-green-500 to-emerald-500",
      href: "/tools/code-formatter",
    },
    {
      id: "image-compressor",
      name: "图片压缩",
      description: "在线压缩图片，减小文件大小",
      icon: <FileImageOutlined style={{ fontSize: 28 }} />,
      color: "from-indigo-500 to-purple-500",
      href: "/tools/image-compressor",
    },
    {
      id: "base64",
      name: "Base64 编解码",
      description: "文本和图片的 Base64 转换",
      icon: <FileTextOutlined style={{ fontSize: 28 }} />,
      color: "from-pink-500 to-rose-500",
      href: "/tools/base64",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">开发小工具</h1>
          <p className="text-gray-400">提升开发效率的实用工具集合</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <Link key={tool.id} href={tool.href}>
              <Card
                hoverable
                className="h-full animate-fade-in-up opacity-0 group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: "rgba(20, 20, 20, 0.5)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  {tool.icon}
                </div>

                <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>

                <p className="text-sm text-gray-400">{tool.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">即将推出</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["正则表达式测试", "Markdown 编辑器", "CSS 动画生成器", "API 测试工具"].map((tool, index) => (
              <Card
                key={tool}
                className="border-dashed animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${0.6 + index * 0.1}s`,
                  background: "rgba(20, 20, 20, 0.3)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="text-center">
                  <ToolOutlined className="mx-auto mb-2 text-gray-500" style={{ fontSize: 32 }} />
                  <p className="text-sm font-medium text-gray-400">{tool}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
