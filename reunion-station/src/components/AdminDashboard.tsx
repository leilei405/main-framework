"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Progress, List, Typography, Tag } from "antd"
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  WarningOutlined,
  TrendingUpOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/adminService"
import type { AdminStats, AuditLog } from "@/types/admin"

const { Title, Text } = Typography

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsData, logsData] = await Promise.all([
        adminService.getStats(token!),
        adminService.getAuditLogs(token!, { limit: 10 }),
      ])

      setStats(statsData)
      setRecentLogs(logsData.logs)
    } catch (error) {
      console.error("加载仪表板数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!stats) return null

  const userActiveRate = ((stats.users.active / stats.users.total) * 100).toFixed(1)
  const itemApprovalRate = ((stats.items.approved / stats.items.total) * 100).toFixed(1)
  const childFoundRate = ((stats.missingChildren.found / stats.missingChildren.total) * 100).toFixed(1)

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        管理仪表板
      </Title>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户活跃率"
              value={userActiveRate}
              suffix="%"
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Progress percent={Number(userActiveRate)} size="small" strokeColor="#1890ff" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="物品审核率"
              value={itemApprovalRate}
              suffix="%"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <Progress percent={Number(itemApprovalRate)} size="small" strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="儿童找回率"
              value={childFoundRate}
              suffix="%"
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
            <Progress percent={Number(childFoundRate)} size="small" strokeColor="#f5222d" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="匹配成功率"
              value={((stats.matches.confirmed / stats.matches.total) * 100).toFixed(1)}
              suffix="%"
              prefix={<TrendingUpOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <Progress
              percent={Number(((stats.matches.confirmed / stats.matches.total) * 100).toFixed(1))}
              size="small"
              strokeColor="#faad14"
            />
          </Card>
        </Col>
      </Row>

      {/* 待处理事项 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="待处理事项" extra={<WarningOutlined style={{ color: "#faad14" }} />}>
            <List size="small">
              <List.Item>
                <List.Item.Meta title="待审核物品" description={`${stats.items.pending} 个物品等待审核`} />
                <Tag color="orange">{stats.items.pending}</Tag>
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  title="待审核失踪儿童"
                  description={`${stats.missingChildren.pending} 个信息等待审核`}
                />
                <Tag color="red">{stats.missingChildren.pending}</Tag>
              </List.Item>
              <List.Item>
                <List.Item.Meta title="待处理举报" description={`${stats.reports.pending} 个举报等待处理`} />
                <Tag color="volcano">{stats.reports.pending}</Tag>
              </List.Item>
              <List.Item>
                <List.Item.Meta title="待确认匹配" description={`${stats.matches.pending} 个匹配等待确认`} />
                <Tag color="blue">{stats.matches.pending}</Tag>
              </List.Item>
            </List>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="最近操作" extra={<ClockCircleOutlined />}>
            <List
              size="small"
              dataSource={recentLogs}
              renderItem={(log) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{log.adminName}</Text>
                        <Text>{log.action}</Text>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">{log.details}</Text>
                        <Text type="secondary">{new Date(log.createdAt).toLocaleString()}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
