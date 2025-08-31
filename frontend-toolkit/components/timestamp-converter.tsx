"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, Input, Button, Space, Select, Typography, Row, Col, Alert } from "antd"
import { ClockCircleOutlined, CopyOutlined, ReloadOutlined, CalendarOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { Option } = Select

type TimestampConverterProps = {}

export default function TimestampConverter({}: TimestampConverterProps) {
  const [timestamp, setTimestamp] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
  const [timestampUnit, setTimestampUnit] = useState<"seconds" | "milliseconds">("milliseconds")
  const [dateFormat, setDateFormat] = useState("iso")
  const [error, setError] = useState("")

  // 更新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 时间戳转日期
  const timestampToDate = useCallback(
    (ts: string) => {
      if (!ts.trim()) {
        setDateTime("")
        setError("")
        return
      }

      try {
        const numTs = Number.parseInt(ts)
        if (isNaN(numTs)) {
          setError("请输入有效的时间戳")
          setDateTime("")
          return
        }

        const date = new Date(timestampUnit === "seconds" ? numTs * 1000 : numTs)

        if (isNaN(date.getTime())) {
          setError("无效的时间戳")
          setDateTime("")
          return
        }

        let formattedDate = ""
        switch (dateFormat) {
          case "iso":
            formattedDate = date.toISOString()
            break
          case "local":
            formattedDate = date.toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            break
          case "utc":
            formattedDate = date.toUTCString()
            break
          case "date-only":
            formattedDate = date.toLocaleDateString("zh-CN")
            break
          case "time-only":
            formattedDate = date.toLocaleTimeString("zh-CN", { hour12: false })
            break
          default:
            formattedDate = date.toString()
        }

        setDateTime(formattedDate)
        setError("")
      } catch (err) {
        setError("转换失败")
        setDateTime("")
      }
    },
    [timestampUnit, dateFormat],
  )

  // 日期转时间戳
  const dateToTimestamp = useCallback(
    (dateStr: string) => {
      if (!dateStr.trim()) {
        setTimestamp("")
        setError("")
        return
      }

      try {
        const date = new Date(dateStr)

        if (isNaN(date.getTime())) {
          setError("请输入有效的日期格式")
          setTimestamp("")
          return
        }

        const ts = timestampUnit === "seconds" ? Math.floor(date.getTime() / 1000) : date.getTime()

        setTimestamp(ts.toString())
        setError("")
      } catch (err) {
        setError("转换失败")
        setTimestamp("")
      }
    },
    [timestampUnit],
  )

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTimestamp(value)
    timestampToDate(value)
  }

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateTime(value)
    dateToTimestamp(value)
  }

  const handleTimestampUnitChange = (unit: "seconds" | "milliseconds") => {
    setTimestampUnit(unit)
    if (timestamp) {
      timestampToDate(timestamp)
    }
  }

  const handleDateFormatChange = (format: string) => {
    setDateFormat(format)
    if (timestamp) {
      timestampToDate(timestamp)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const useCurrentTimestamp = () => {
    const ts =
      timestampUnit === "seconds" ? Math.floor(currentTimestamp / 1000).toString() : currentTimestamp.toString()
    setTimestamp(ts)
    timestampToDate(ts)
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    let formattedDate = ""

    switch (dateFormat) {
      case "iso":
        formattedDate = now.toISOString()
        break
      case "local":
        formattedDate = now.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        break
      case "utc":
        formattedDate = now.toUTCString()
        break
      case "date-only":
        formattedDate = now.toLocaleDateString("zh-CN")
        break
      case "time-only":
        formattedDate = now.toLocaleTimeString("zh-CN", { hour12: false })
        break
      default:
        formattedDate = now.toString()
    }

    setDateTime(formattedDate)
    dateToTimestamp(formattedDate)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-foreground mb-2">
          时间戳转换工具
        </Title>
        <Text className="text-muted-foreground">时间戳与日期格式的双向转换，支持秒级和毫秒级时间戳</Text>
      </div>

      {/* 当前时间显示 */}
      <Card className="mb-6 bg-muted border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <ClockCircleOutlined className="text-accent text-xl" />
            <div>
              <Text strong className="text-foreground">
                当前时间戳
              </Text>
              <div className="flex items-center space-x-4 mt-1">
                <Text className="text-muted-foreground">秒级: {Math.floor(currentTimestamp / 1000)}</Text>
                <Text className="text-muted-foreground">毫秒级: {currentTimestamp}</Text>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Text className="text-muted-foreground">{new Date(currentTimestamp).toLocaleString("zh-CN")}</Text>
            <Button size="small" icon={<ReloadOutlined />} onClick={useCurrentTimestamp}>
              使用当前时间戳
            </Button>
          </div>
        </div>
      </Card>

      {/* 错误提示 */}
      {error && <Alert message={error} type="error" className="mb-4 bg-red-50 border-red-200" showIcon />}

      {/* 转换设置 */}
      <Card className="mb-6 bg-card border-border">
        <Title level={4} className="text-foreground mb-4">
          转换设置
        </Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="mb-2">
              <Text className="text-foreground">时间戳单位</Text>
            </div>
            <Select value={timestampUnit} onChange={handleTimestampUnitChange} className="w-full">
              <Option value="milliseconds">毫秒 (JavaScript 标准)</Option>
              <Option value="seconds">秒 (Unix 标准)</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12}>
            <div className="mb-2">
              <Text className="text-foreground">日期格式</Text>
            </div>
            <Select value={dateFormat} onChange={handleDateFormatChange} className="w-full">
              <Option value="iso">ISO 8601 (2024-01-01T12:00:00.000Z)</Option>
              <Option value="local">本地格式 (2024/01/01 12:00:00)</Option>
              <Option value="utc">UTC 格式 (Mon, 01 Jan 2024 12:00:00 GMT)</Option>
              <Option value="date-only">仅日期 (2024/1/1)</Option>
              <Option value="time-only">仅时间 (12:00:00)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 转换区域 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined />
                <span>时间戳</span>
              </div>
            }
            className="h-full bg-card border-border"
            extra={
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(timestamp)}
                disabled={!timestamp}
              >
                复制
              </Button>
            }
          >
            <Input
              placeholder={`请输入${timestampUnit === "seconds" ? "秒级" : "毫秒级"}时间戳`}
              value={timestamp}
              onChange={handleTimestampChange}
              size="large"
              className="mb-4"
            />
            <Space>
              <Button icon={<ReloadOutlined />} onClick={useCurrentTimestamp}>
                当前时间戳
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <CalendarOutlined />
                <span>日期时间</span>
              </div>
            }
            className="h-full bg-card border-border"
            extra={
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(dateTime)}
                disabled={!dateTime}
              >
                复制
              </Button>
            }
          >
            <Input
              placeholder="请输入日期时间 (如: 2024-01-01 12:00:00)"
              value={dateTime}
              onChange={handleDateTimeChange}
              size="large"
              className="mb-4"
            />
            <Space>
              <Button icon={<ReloadOutlined />} onClick={getCurrentDateTime}>
                当前时间
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 使用说明 */}
      <Card className="mt-6 bg-muted border-border">
        <Title level={4} className="text-foreground mb-3">
          使用说明
        </Title>
        <div className="space-y-2 text-muted-foreground">
          <div>• 在时间戳输入框中输入数字，右侧会自动显示对应的日期时间</div>
          <div>• 在日期时间输入框中输入日期，左侧会自动显示对应的时间戳</div>
          <div>• 支持多种日期格式输入：2024-01-01、2024/01/01 12:00:00、Jan 1, 2024等</div>
          <div>• 可以选择时间戳单位（秒/毫秒）和输出的日期格式</div>
          <div>• 点击"使用当前时间戳"或"当前时间"按钮快速填入当前时间</div>
        </div>
      </Card>
    </div>
  )
}
