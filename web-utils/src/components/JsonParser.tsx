import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Card, message, Alert, Row, Col, Button, Tooltip } from "antd";
import {
  CopyOutlined,
  ClearOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "../styles/JsonParser.css";

const JsonParser: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>("");
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleParse = () => {
    if (!inputJson.trim()) {
      message.error("请输入JSON数据");
      setError("请输入JSON数据");
      setFormattedJson("");
      return;
    }

    try {
      const parsedJson = JSON.parse(inputJson);
      setFormattedJson(JSON.stringify(parsedJson, null, 2));
      setError("");
      message.success("JSON解析成功");
    } catch (err) {
      const errorMsg = `解析错误: ${
        err instanceof Error ? err.message : "未知错误"
      }`;
      setError(errorMsg);
      setFormattedJson("");
      message.error(errorMsg);
    }
  };

  const handleClear = () => {
    setInputJson("");
    setFormattedJson("");
    setError("");
    message.info("已清空数据");
  };

  const handleCopy = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson).then(() => {
        message.success("格式化结果已复制到剪贴板");
      });
    }
  };

  const handleFormatInput = () => {
    if (inputJson.trim()) {
      try {
        const parsedJson = JSON.parse(inputJson);
        setInputJson(JSON.stringify(parsedJson, null, 2));
        message.success("输入JSON已格式化");
      } catch (err) {
        message.error("输入内容不是有效的JSON，无法格式化");
      }
    }
  };

  return (
    <div className="json-parser">
      <Card title="JSON解析器" className="parser-card" bordered={false}>
        {/* 工具栏 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="toolbar">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleParse}
                size="large"
              >
                解析并格式化
              </Button>
              <Tooltip title="格式化输入的JSON">
                <Button icon={<ReloadOutlined />} onClick={handleFormatInput}>
                  格式化输入
                </Button>
              </Tooltip>
              <Tooltip title="复制格式化后的结果">
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  disabled={!formattedJson}
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
                message="解析错误"
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
                    value={inputJson}
                    onChange={(value) => setInputJson(value || "")}
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
                  title="格式化结果"
                  className="output-card editor-container"
                  bordered={false}
                >
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={formattedJson}
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

export default JsonParser;
