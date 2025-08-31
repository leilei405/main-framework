"use client"

import { useState, useCallback } from "react"
import { Button, Space, Alert, Typography, Card, Row, Col, Input, Switch, Select } from "antd"
import {
  SwapOutlined,
  CopyOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import Editor from "@monaco-editor/react"

const { Title, Text } = Typography
const { Option } = Select

type JsonToTsProps = {}

export default function JsonToTs({}: JsonToTsProps) {
  const [inputJson, setInputJson] = useState("")
  const [outputTs, setOutputTs] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [interfaceName, setInterfaceName] = useState("RootInterface")
  const [useOptional, setUseOptional] = useState(false)
  const [exportInterface, setExportInterface] = useState(true)
  const [arrayStyle, setArrayStyle] = useState<"bracket" | "generic">("bracket")

  const getTypeFromValue = useCallback(
    (value: any, key?: string): string => {
      if (value === null) return "null"
      if (value === undefined) return "undefined"

      const type = typeof value

      switch (type) {
        case "string":
          return "string"
        case "number":
          return "number"
        case "boolean":
          return "boolean"
        case "object":
          if (Array.isArray(value)) {
            if (value.length === 0) {
              return arrayStyle === "bracket" ? "any[]" : "Array<any>"
            }
            const firstItemType = getTypeFromValue(value[0])
            return arrayStyle === "bracket" ? `${firstItemType}[]` : `Array<${firstItemType}>`
          }
          return generateInterfaceName(key || "Object")
        default:
          return "any"
      }
    },
    [arrayStyle],
  )

  const generateInterfaceName = (key: string): string => {
    const cleaned = key.replace(/[^a-zA-Z0-9]/g, "")
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    return capitalized || "Interface"
  }

  const generateInterface = useCallback(
    (obj: any, name: string, interfaces: Set<string>): string => {
      if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return ""
      }

      const properties: string[] = []
      const nestedInterfaces: string[] = []

      Object.entries(obj).forEach(([key, value]) => {
        const optional = useOptional ? "?" : ""
        let type = getTypeFromValue(value, key)

        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          const nestedInterfaceName = generateInterfaceName(key)
          if (!interfaces.has(nestedInterfaceName)) {
            interfaces.add(nestedInterfaceName)
            const nestedInterface = generateInterface(value, nestedInterfaceName, interfaces)
            if (nestedInterface) {
              nestedInterfaces.push(nestedInterface)
            }
          }
          type = nestedInterfaceName
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
          const itemInterfaceName = generateInterfaceName(key.replace(/s$/, ""))
          if (!interfaces.has(itemInterfaceName)) {
            interfaces.add(itemInterfaceName)
            const itemInterface = generateInterface(value[0], itemInterfaceName, interfaces)
            if (itemInterface) {
              nestedInterfaces.push(itemInterface)
            }
          }
          type = arrayStyle === "bracket" ? `${itemInterfaceName}[]` : `Array<${itemInterfaceName}>`
        }

        properties.push(`  ${key}${optional}: ${type}`)
      })

      const exportKeyword = exportInterface ? "export " : ""
      const interfaceDefinition = `${exportKeyword}interface ${name} {\n${properties.join("\n")}\n}`

      return nestedInterfaces.length > 0
        ? `${nestedInterfaces.join("\n\n")}\n\n${interfaceDefinition}`
        : interfaceDefinition
    },
    [useOptional, exportInterface, arrayStyle, getTypeFromValue],
  )

  const convertJsonToTs = useCallback(
    (jsonString: string) => {
      if (!jsonString.trim()) {
        setOutputTs("")
        setIsValid(null)
        setErrorMessage("")
        return
      }

      try {
        const parsed = JSON.parse(jsonString)
        const interfaces = new Set<string>([interfaceName])
        const tsInterface = generateInterface(parsed, interfaceName, interfaces)

        setOutputTs(tsInterface)
        setIsValid(true)
        setErrorMessage("")
      } catch (error) {
        setIsValid(false)
        setErrorMessage(error instanceof Error ? error.message : "未知错误")
        setOutputTs("")
      }
    },
    [interfaceName, generateInterface],
  )

  const handleInputChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || ""
      setInputJson(newValue)
      convertJsonToTs(newValue)
    },
    [convertJsonToTs],
  )

  const handleConvert = () => {
    convertJsonToTs(inputJson)
  }

  const handleClear = () => {
    setInputJson("")
    setOutputTs("")
    setIsValid(null)
    setErrorMessage("")
  }

  const handleCopy = async () => {
    if (outputTs) {
      try {
        await navigator.clipboard.writeText(outputTs)
      } catch (err) {
        console.error("复制失败:", err)
      }
    }
  }

  const handleSettingsChange = () => {
    if (inputJson.trim()) {
      convertJsonToTs(inputJson)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-2">
          JSON转TS类型工具
        </Title>
        <Text className="text-muted-foreground">将JSON数据转换为TypeScript接口定义，支持嵌套对象和数组类型推断</Text>
      </div>

      {/* 配置选项 */}
      <Card className="mb-4 bg-card border-border">
        <div className="flex items-center space-x-2 mb-4">
          <SettingOutlined className="text-accent" />
          <Title level={4} className="text-foreground mb-0">
            生成配置
          </Title>
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-2">
              <Text className="text-foreground">接口名称</Text>
            </div>
            <Input
              value={interfaceName}
              onChange={(e) => {
                setInterfaceName(e.target.value || "RootInterface")
                handleSettingsChange()
              }}
              placeholder="接口名称"
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-2">
              <Text className="text-foreground">数组类型风格</Text>
            </div>
            <Select
              value={arrayStyle}
              onChange={(value) => {
                setArrayStyle(value)
                handleSettingsChange()
              }}
              className="w-full"
            >
              <Option value="bracket">Type[] (推荐)</Option>
              <Option value="generic">Array&lt;Type&gt;</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-2">
              <Text className="text-foreground">可选属性</Text>
            </div>
            <Switch
              checked={useOptional}
              onChange={(checked) => {
                setUseOptional(checked)
                handleSettingsChange()
              }}
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="mb-2">
              <Text className="text-foreground">导出接口</Text>
            </div>
            <Switch
              checked={exportInterface}
              onChange={(checked) => {
                setExportInterface(checked)
                handleSettingsChange()
              }}
              checkedChildren="export"
              unCheckedChildren="local"
            />
          </Col>
        </Row>
      </Card>

      {/* 操作按钮 */}
      <div className="mb-4">
        <Space wrap>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={handleConvert}
            className="bg-primary hover:bg-primary/90"
          >
            转换
          </Button>
          <Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!outputTs}>
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
              message="JSON 格式正确，已生成 TypeScript 接口"
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
            title="TypeScript 接口"
            className="h-full bg-card border-border"
            bodyStyle={{ padding: 0, height: "calc(100% - 57px)" }}
          >
            <Editor
              height="500px"
              defaultLanguage="typescript"
              value={outputTs}
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
          <div>• 系统会自动解析JSON结构并生成对应的TypeScript接口定义</div>
          <div>• 支持嵌套对象、数组类型的自动推断和接口生成</div>
          <div>• 可以自定义接口名称、数组类型风格、可选属性等配置</div>
          <div>• 生成的接口可以直接复制到TypeScript项目中使用</div>
        </div>
      </Card>
    </div>
  )
}
