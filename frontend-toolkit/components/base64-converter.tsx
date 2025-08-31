"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, Input, Button, Space, Typography, Row, Col, Alert, Select, Upload } from "antd"
import {
  ToolOutlined,
  CopyOutlined,
  ClearOutlined,
  SwapOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

type Base64ConverterProps = {}

export default function Base64Converter({}: Base64ConverterProps) {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [inputType, setInputType] = useState<"text" | "file">("text")
  const [error, setError] = useState("")

  const encodeText = useCallback((text: string) => {
    if (!text.trim()) {
      setOutputText("")
      setError("")
      return
    }

    try {
      const result = btoa(unescape(encodeURIComponent(text)))
      setOutputText(result)
      setError("")
    } catch (err) {
      setError("编码失败")
      setOutputText("")
    }
  }, [])

  const decodeText = useCallback((text: string) => {
    if (!text.trim()) {
      setOutputText("")
      setError("")
      return
    }

    try {
      const result = decodeURIComponent(escape(atob(text)))
      setOutputText(result)
      setError("")
    } catch (err) {
      setError("解码失败，请检查Base64格式")
      setOutputText("")
    }
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setInputText(value)

      if (mode === "encode") {
        encodeText(value)
      } else {
        decodeText(value)
      }
    },
    [mode, encodeText, decodeText],
  )

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode)
    if (inputText.trim()) {
      if (newMode === "encode") {
        encodeText(inputText)
      } else {
        decodeText(inputText)
      }
    }
  }

  const handleSwap = () => {
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
    handleModeChange(mode === "encode" ? "decode" : "encode")
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError("")
  }

  const handleCopy = async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText)
      } catch (err) {
        console.error("复制失败:", err)
      }
    }
  }

  const handleFileUpload: UploadProps["beforeUpload"] = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (mode === "encode") {
        // 对于文件内容，直接使用btoa
        try {
          const result = btoa(content)
          setInputText(content)
          setOutputText(result)
          setError("")
        } catch (err) {
          setError("文件编码失败")
        }
      } else {
        setInputText(content)
        decodeText(content)
      }
    }
    reader.readAsText(file)
    return false // 阻止自动上传
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-2">
          Base64转换工具
        </Title>
        <Text className="text-muted-foreground">Base64编码解码转换，支持文本和文件处理</Text>
      </div>

      {/* 配置选项 */}
      <Card className="mb-4 bg-card border-border">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <div className="mb-2">
              <Text className="text-foreground">操作模式</Text>
            </div>
            <Select value={mode} onChange={handleModeChange} className="w-full">
              <Option value="encode">编码 (Encode)</Option>
              <Option value="decode">解码 (Decode)</Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <div className="mb-2">
              <Text className="text-foreground">输入类型</Text>
            </div>
            <Select value={inputType} onChange={setInputType} className="w-full">
              <Option value="text">文本输入</Option>
              <Option value="file">文件上传</Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            {inputType === "file" && (
              <>
                <div className="mb-2">
                  <Text className="text-foreground">上传文件</Text>
                </div>
                <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".txt,.json,.xml,.csv">
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </>
            )}
          </Col>

          <Col xs={24} sm={6}>
            <div className="mb-2">
              <Text className="text-foreground">快速操作</Text>
            </div>
            <Space>
              <Button icon={<SwapOutlined />} onClick={handleSwap} disabled={!inputText && !outputText}>
                交换
              </Button>
              <Button danger icon={<ClearOutlined />} onClick={handleClear}>
                清空
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 错误提示 */}
      {error && <Alert message={error} type="error" className="mb-4 bg-red-50 border-red-200" showIcon />}

      {/* 转换区域 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <FileTextOutlined />
                <span>输入内容</span>
              </div>
            }
            className="h-full bg-card border-border"
          >
            <TextArea
              placeholder={mode === "encode" ? "请输入需要编码的文本" : "请输入需要解码的Base64文本"}
              value={inputText}
              onChange={handleInputChange}
              rows={12}
              className="mb-4"
              disabled={inputType === "file"}
            />
            {inputType === "file" && <Text className="text-muted-foreground">请使用上方的文件上传功能选择文件</Text>}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ToolOutlined />
                  <span>{mode === "encode" ? "Base64编码结果" : "解码结果"}</span>
                </div>
                <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} disabled={!outputText}>
                  复制
                </Button>
              </div>
            }
            className="h-full bg-card border-border"
          >
            <TextArea
              value={outputText}
              readOnly
              rows={12}
              className="mb-4"
              placeholder={mode === "encode" ? "Base64编码结果将显示在这里" : "解码结果将显示在这里"}
            />
          </Card>
        </Col>
      </Row>

      {/* 使用说明 */}
      <Card className="mt-6 bg-muted border-border">
        <Title level={4} className="text-foreground mb-3">
          使用说明
        </Title>
        <div className="space-y-2 text-muted-foreground">
          <div>• Base64是一种基于64个可打印字符来表示二进制数据的编码方式</div>
          <div>• 支持文本直接输入和文件上传两种方式</div>
          <div>• 编码模式：将普通文本转换为Base64格式</div>
          <div>• 解码模式：将Base64格式转换回原始文本</div>
          <div>• 支持中文和特殊字符的正确编码解码</div>
        </div>
      </Card>
    </div>
  )
}
