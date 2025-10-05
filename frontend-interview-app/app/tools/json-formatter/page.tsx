"use client"

import { Header } from "@/components/header"
import { Card, Button, Input, message } from "antd"
import { CopyOutlined, CheckOutlined } from "@ant-design/icons"
import { useState } from "react"

const { TextArea } = Input

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
      message.success("JSON 格式化成功")
    } catch (e) {
      setError("无效的 JSON 格式")
      setOutput("")
      message.error("无效的 JSON 格式")
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
      message.success("JSON 压缩成功")
    } catch (e) {
      setError("无效的 JSON 格式")
      setOutput("")
      message.error("无效的 JSON 格式")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    message.success("已复制到剪贴板")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-white">JSON 格式化工具</h1>
          <p className="text-gray-400">美化、压缩和验证 JSON 数据</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <Card
            title="输入 JSON"
            style={{ background: "rgba(20, 20, 20, 0.5)", borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <TextArea
              placeholder='{"name": "example", "value": 123}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: 400, fontFamily: "monospace", fontSize: 14 }}
            />
            <div className="mt-4 flex gap-2">
              <Button type="primary" onClick={formatJson}>
                格式化
              </Button>
              <Button onClick={minifyJson}>压缩</Button>
              <Button onClick={() => setInput("")}>清空</Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </Card>

          {/* Output */}
          <Card
            title="输出结果"
            extra={
              output && (
                <Button size="small" icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={copyToClipboard}>
                  {copied ? "已复制" : "复制"}
                </Button>
              )
            }
            style={{ background: "rgba(20, 20, 20, 0.5)", borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <TextArea
              value={output}
              readOnly
              style={{ minHeight: 400, fontFamily: "monospace", fontSize: 14 }}
              placeholder="格式化后的 JSON 将显示在这里..."
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
