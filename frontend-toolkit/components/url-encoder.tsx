"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, Input, Button, Space, Typography, Row, Col, Alert, Select } from "antd"
import { FormatPainterOutlined, CopyOutlined, ClearOutlined, SwapOutlined, LinkOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

type UrlEncoderProps = {}

export default function UrlEncoder({}: UrlEncoderProps) {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [encodingType, setEncodingType] = useState<"component" | "uri">("component")
  const [error, setError] = useState("")

  const encodeText = useCallback(
    (text: string) => {
      if (!text.trim()) {
        setOutputText("")
        setError("")
        return
      }

      try {
        let result = ""
        if (encodingType === "component") {
          result = encodeURIComponent(text)
        } else {
          result = encodeURI(text)
        }
        setOutputText(result)
        setError("")
      } catch (err) {
        setError("编码失败")
        setOutputText("")
      }
    },
    [encodingType],
  )

  const decodeText = useCallback((text: string) => {
    if (!text.trim()) {
      setOutputText("")
      setError("")
      return
    }

    try {
      const result = decodeURIComponent(text)
      setOutputText(result)
      setError("")
    } catch (err) {
      setError("解码失败，请检查输入格式")
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

  const handleEncodingTypeChange = (type: "component" | "uri") => {
    setEncodingType(type)
    if (mode === "encode" && inputText.trim()) {
      encodeText(inputText)
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-2">
          URL编码解码工具
        </Title>
        <Text className="text-muted-foreground">URL编码和解码处理，支持encodeURIComponent和encodeURI两种模式</Text>
      </div>

      {/* 配置选项 */}
      <Card className="mb-4 bg-card border-border">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <div className="mb-2">
              <Text className="text-foreground">操作模式</Text>
            </div>
            <Select value={mode} onChange={handleModeChange} className="w-full">
              <Option value="encode">编码 (Encode)</Option>
              <Option value="decode">解码 (Decode)</Option>
            </Select>
          </Col>

          {mode === "encode" && (
            <Col xs={24} sm={8}>
              <div className="mb-2">
                <Text className="text-foreground">编码类型</Text>
              </div>
              <Select value={encodingType} onChange={handleEncodingTypeChange} className="w-full">
                <Option value="component">encodeURIComponent (推荐)</Option>
                <Option value="uri">encodeURI</Option>
              </Select>
            </Col>
          )}

          <Col xs={24} sm={8}>
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

      {/* 编码解码区域 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <LinkOutlined />
                <span>输入文本</span>
              </div>
            }
            className="h-full bg-card border-border"
          >
            <TextArea
              placeholder={mode === "encode" ? "请输入需要编码的文本或URL" : "请输入需要解码的URL编码文本"}
              value={inputText}
              onChange={handleInputChange}
              rows={12}
              className="mb-4"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FormatPainterOutlined />
                  <span>{mode === "encode" ? "编码结果" : "解码结果"}</span>
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
              placeholder={mode === "encode" ? "编码结果将显示在这里" : "解码结果将显示在这里"}
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
          <div>
            • <strong>encodeURIComponent</strong>: 编码所有特殊字符，适用于URL参数值
          </div>
          <div>
            • <strong>encodeURI</strong>: 保留URL结构字符（如 :/?#[]@），适用于完整URL
          </div>
          <div>• 支持编码和解码模式切换，可以双向转换</div>
          <div>• 使用"交换"按钮可以快速将输出结果作为新的输入</div>
        </div>
      </Card>
    </div>
  )
}
