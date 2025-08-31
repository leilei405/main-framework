import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, Input, message, Alert, Row, Col, Button, Tooltip } from "antd";
import {
  CopyOutlined,
  ClearOutlined,
  CodeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "../styles/JsonToTsConverter.css";

const JsonToTsConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [tsOutput, setTsOutput] = useState<string>("");
  const [interfaceName, setInterfaceName] = useState<string>("RootObject");
  const [error, setError] = useState<string>("");

  const convertJsonToTs = () => {
    if (!jsonInput.trim()) {
      message.error("请输入JSON数据");
      setError("请输入JSON数据");
      setTsOutput("");
      return;
    }

    if (!interfaceName.trim()) {
      message.error("请输入接口名称");
      setError("请输入接口名称");
      setTsOutput("");
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const tsTypes = generateTypeDefinition(parsedJson, interfaceName);
      setTsOutput(tsTypes);
      setError("");
      message.success("JSON转TypeScript成功");
    } catch (err) {
      const errorMsg = `解析错误: ${
        err instanceof Error ? err.message : "未知错误"
      }`;
      setError(errorMsg);
      setTsOutput("");
      message.error(errorMsg);
    }
  };

  const generateTypeDefinition = (json: any, name: string): string => {
    const processedObjects = new Map<any, string>();
    const typeDefinitions: string[] = [];

    const processValue = (value: any, path: string = name): string => {
      // 处理null值
      if (value === null) {
        return "null";
      }

      // 处理基本类型
      if (typeof value !== "object") {
        if (typeof value === "string") {
          // 检查是否为ISO日期格式
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(value)) {
            return "Date";
          }
        }
        return typeof value;
      }

      // 处理数组
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "any[]";
        }

        // 获取数组中所有元素的类型
        const elementTypes = new Set<string>();
        value.forEach((item) => {
          elementTypes.add(processValue(item, `${path}Item`));
        });

        const elementTypeArray = Array.from(elementTypes);
        if (elementTypeArray.length === 1) {
          return `${elementTypeArray[0]}[]`;
        } else {
          return `${elementTypeArray.join(" | ")}[]`;
        }
      }

      // 处理对象
      // 检查是否已经处理过这个对象引用
      if (processedObjects.has(value)) {
        return processedObjects.get(value)!;
      }

      processedObjects.set(value, name);

      const properties: string[] = [];
      Object.keys(value).forEach((key) => {
        // 处理属性名，确保是有效的TypeScript标识符
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
          ? key
          : `'${key}'`;

        const propertyType = processValue(
          value[key],
          `${name}${capitalize(key)}`
        );
        properties.push(`  ${safeKey}: ${propertyType};`);
      });

      const interfaceDefinition = `interface ${name} {\n${properties.join(
        "\n"
      )}\n}`;
      typeDefinitions.push(interfaceDefinition);

      return name;
    };

    const resultType = processValue(json);

    // 确保主接口定义在最前面
    const mainIndex = typeDefinitions.findIndex((def) =>
      def.startsWith(`interface ${name}`)
    );
    if (mainIndex > 0) {
      const mainDef = typeDefinitions.splice(mainIndex, 1)[0];
      typeDefinitions.unshift(mainDef);
    }

    return typeDefinitions.join("\n\n");
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleCopy = () => {
    if (tsOutput) {
      navigator.clipboard.writeText(tsOutput).then(() => {
        message.success("TypeScript类型定义已复制到剪贴板");
      });
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setTsOutput("");
    setError("");
    message.info("已清空数据");
  };

  const handleFormatJson = () => {
    if (jsonInput.trim()) {
      try {
        const parsedJson = JSON.parse(jsonInput);
        setJsonInput(JSON.stringify(parsedJson, null, 2));
        message.success("JSON已格式化");
      } catch (err) {
        message.error("输入内容不是有效的JSON，无法格式化");
      }
    }
  };

  return (
    <div className="json-to-ts-converter">
      <Card
        title="JSON转TypeScript类型"
        className="converter-card"
        bordered={false}
      >
        {/* 接口名称输入 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input
              placeholder="接口名称，默认为RootObject"
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
              size="large"
            />
          </Col>
        </Row>

        {/* 工具栏 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="toolbar">
              <Button
                type="primary"
                icon={<CodeOutlined />}
                onClick={convertJsonToTs}
                size="large"
              >
                转换为TS类型
              </Button>
              <Tooltip title="格式化输入的JSON">
                <Button icon={<ReloadOutlined />} onClick={handleFormatJson}>
                  格式化JSON
                </Button>
              </Tooltip>
              <Tooltip title="复制生成的TypeScript类型定义">
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  disabled={!tsOutput}
                >
                  复制结果
                </Button>
              </Tooltip>
              <Tooltip title="清空所有内容">
                <Button danger icon={<ClearOutlined />} onClick={handleClear}>
                  清空
                </Button>
              </Tooltip>
            </div>
          </Col>
        </Row>

        {error && (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                message="转换错误"
                description={error}
                type="error"
                showIcon
              />
            </Col>
          </Row>
        )}

        {/* 左右布局 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="split-layout">
              <div className="left-panel">
                <Card
                  title="输入JSON数据"
                  className="input-card editor-container"
                  bordered={false}
                >
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={jsonInput}
                    onChange={(value) => setJsonInput(value || "")}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </Card>
              </div>
              <div className="right-panel">
                <Card
                  title="TypeScript类型定义"
                  className="output-card editor-container"
                  bordered={false}
                >
                  <Editor
                    height="100%"
                    defaultLanguage="typescript"
                    value={tsOutput}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default JsonToTsConverter;
