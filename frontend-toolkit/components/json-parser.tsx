"use client"

import { useState, useCallback } from "react"
import { Button, Space, Alert, Typography, Card, Row, Col } from "antd"
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FormatPainterOutlined,
  ClearOutlined,
  CopyOutlined,
} from "@ant-design/icons"
import Editor from "@monaco-editor/react"

const { Title, Text } = Typography

type JsonParserProps = {}

export default function JsonParser({}: JsonParserProps) {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const validateAndFormat = useCallback((jsonString: string) => {
    if (!jsonString.trim()) {
      setOutputJson("")
      setIsValid(null)
      setErrorMessage("")
      return
    }

    try {
      const parsed = JSON.parse(jsonString)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutputJson(formatted)
      setIsValid(true)
      setErrorMessage("")
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error instanceof Error ? error.message : "未知错误")
      setOutputJson("")
    }
  }, [])

  const handleInputChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || ""
      setInputJson(newValue)
      validateAndFormat(newValue)
    },
    [validateAndFormat],
  )

  const handleFormat = () => {
    validateAndFormat(inputJson)
  }

  const handleClear = () => {
    setInputJson("")
    setOutputJson("")
    setIsValid(null)
    setErrorMessage("")
  }

  const handleCopy = async () => {
    if (outputJson) {
      try {
        await navigator.clipboard.writeText(outputJson)
      } catch (err) {
        console.error("复制失败:", err)
      }
    }
  }

  const handleMinify = () => {
    if (inputJson.trim()) {
      try {
        const parsed = JSON.parse(inputJson)
        const minified = JSON.stringify(parsed)
        setOutputJson(minified)
        setIsValid(true)
        setErrorMessage("")
      } catch (error) {
        setIsValid(false)
        setErrorMessage(error instanceof Error ? error.message : "未知错误")
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-2">
          JSON 解析工具
        </Title>
        <Text className="text-muted-foreground">验证、格式化和压缩JSON数据，支持语法高亮和错误提示</Text>
      </div>

      {/* 操作按钮 */}
      <div className="mb-4">
        <Space wrap>
          <Button
            type="primary"
            icon={<FormatPainterOutlined />}
            onClick={handleFormat}
            className="bg-primary hover:bg-primary/90"
          >
            格式化
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleMinify} disabled={!inputJson.trim()}>
            压缩
          </Button>
          <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!outputJson}>
            复制结果
          </Button>
          <Button danger icon={<ClearOutlined />} onClick={handleClear}>
            清空
          </Button>
        </Space>
      </div>

      {/* 状态提示 */}
      {isValid !== null && (
        <div className="mb-4">
          {isValid ? (
            <Alert
              message="JSON 格式正确"
              type="success"
              icon={<CheckCircleOutlined />}
              showIcon
              className="bg-green-50 border-green-200"
            />
          ) : (
            <Alert
              message="JSON 格式错误"
              description={errorMessage}
              type="error"
              icon={<ExclamationCircleOutlined />}
              showIcon
              className="bg-red-50 border-red-200"
            />
          )}
        </div>
      )}

      {/* 编辑器区域 */}
      <Row gutter={16} className="min-h-[500px]">
        <Col xs={24} lg={12}>
          <Card
            title="输入 JSON"
            className="h-full bg-card border-border"
            bodyStyle={{ padding: 0, height: "calc(100% - 57px)" }}
          >
            <Editor
              height="500px"
              defaultLanguage="json"
              value={inputJson}
              onChange={handleInputChange}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                bracketPairColorization: { enabled: true },
                folding: true,
                foldingHighlight: true,
                showFoldingControls: "always",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="格式化结果"
            className="h-full bg-card border-border"
            bodyStyle={{ padding: 0, height: "calc(100% - 57px)" }}
          >
            <Editor
              height="500px"
              defaultLanguage="json"
              value={outputJson}
              theme="vs-light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                bracketPairColorization: { enabled: true },
                folding: true,
                foldingHighlight: true,
                showFoldingControls: "always",
              }}
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
          <div>• 在左侧输入框中粘贴或输入JSON数据</div>
          <div>• 系统会自动验证JSON格式并在右侧显示格式化结果</div>
          <div>• 使用"格式化"按钮美化JSON，"压缩"按钮移除空格和换行</div>
          <div>• 支持语法高亮、括号匹配和代码折叠功能</div>
        </div>
      </Card>
    </div>
  )
}
