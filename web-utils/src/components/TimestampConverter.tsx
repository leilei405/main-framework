import React, { useState } from "react";
import {
  Card,
  Input,
  Select,
  Button,
  message,
  Alert,
  Row,
  Col,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  ReloadOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import "../styles/TimestampConverter.css";

const { Text } = Typography;
const { Option } = Select;

const TimestampConverter: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [format, setFormat] = useState<string>("yyyy-MM-dd HH:mm:ss");
  const [error, setError] = useState<string>("");

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestamp(value);

    if (value && /^\d+$/.test(value)) {
      try {
        const date = new Date(parseInt(value, 10));
        formatDate(date);
        setError("");
      } catch (err) {
        setError("无效的时间戳");
        setDateTime("");
        message.error("无效的时间戳");
      }
    } else {
      setDateTime("");
      setError("");
    }
  };

  const handleFormatChange = (value: string) => {
    setFormat(value);
    if (timestamp && /^\d+$/.test(timestamp)) {
      const date = new Date(parseInt(timestamp, 10));
      formatDate(date);
    }
  };

  const formatDate = (date: Date) => {
    let result = format;

    result = result.replace("yyyy", date.getFullYear().toString());
    result = result.replace("MM", String(date.getMonth() + 1).padStart(2, "0"));
    result = result.replace("dd", String(date.getDate()).padStart(2, "0"));
    result = result.replace("HH", String(date.getHours()).padStart(2, "0"));
    result = result.replace("mm", String(date.getMinutes()).padStart(2, "0"));
    result = result.replace("ss", String(date.getSeconds()).padStart(2, "0"));

    setDateTime(result);
  };

  const getCurrentTimestamp = () => {
    const now = Date.now();
    setTimestamp(now.toString());
    const date = new Date(now);
    formatDate(date);
    setError("");
    message.success("已获取当前时间戳");
  };

  const handleCopy = () => {
    if (dateTime) {
      navigator.clipboard.writeText(dateTime).then(() => {
        message.success("转换结果已复制到剪贴板");
      });
    }
  };

  return (
    <div className="timestamp-converter">
      <Card title="时间戳转换器" className="converter-card">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="input-group">
              <Text strong style={{ marginRight: 10 }}>
                时间戳：
              </Text>
              <Input
                value={timestamp}
                onChange={handleTimestampChange}
                placeholder="输入时间戳（毫秒）"
                size="large"
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={getCurrentTimestamp}
                size="large"
              >
                当前时间戳
              </Button>
            </div>
          </Col>

          <Col span={24}>
            <div className="format-group">
              <Text strong style={{ marginRight: 10 }}>
                时间格式：
              </Text>
              <Select
                value={format}
                onChange={handleFormatChange}
                size="large"
                style={{ width: 300 }}
              >
                <Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Option>
                <Option value="yyyy/MM/dd HH:mm:ss">yyyy/MM/dd HH:mm:ss</Option>
                <Option value="yyyy年MM月dd日 HH:mm:ss">
                  yyyy年MM月dd日 HH:mm:ss
                </Option>
                <Option value="yyyy-MM-dd">yyyy-MM-dd</Option>
                <Option value="HH:mm:ss">HH:mm:ss</Option>
              </Select>
            </div>
          </Col>

          {error && (
            <Col span={24}>
              <Alert
                message="转换错误"
                description={error}
                type="error"
                showIcon
              />
            </Col>
          )}

          {dateTime && (
            <Col span={24}>
              <Card title="转换结果" className="result-card">
                <div className="result-content">
                  <Text
                    code
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      wordBreak: "break-all",
                    }}
                  >
                    {dateTime}
                  </Text>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    style={{ marginLeft: 10 }}
                  >
                    复制
                  </Button>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default TimestampConverter;
