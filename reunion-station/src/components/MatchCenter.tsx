"use client"

import { useState, useEffect } from "react"
import { Card, List, Button, Tag, Space, Modal, message, Typography, Progress, Alert } from "antd"
import { CheckOutlined, CloseOutlined, EyeOutlined, HeartOutlined } from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"
import { searchService } from "@/services/searchService"
import type { MatchResult } from "@/types/search"
import { MatchStatus, MATCH_STATUS_LABELS } from "@/types/search"

const { Text, Paragraph } = Typography

interface MatchCenterProps {
  visible: boolean
  onClose: () => void
}

export default function MatchCenter({ visible, onClose }: MatchCenterProps) {
  const { token } = useAuth()
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      loadMatches()
    }
  }, [visible])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const result = await searchService.getMatches(token!)
      setMatches(result)
    } catch (error) {
      message.error("加载匹配结果失败")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (matchId: string) => {
    try {
      await searchService.confirmMatch(token!, matchId)
      message.success("匹配已确认")
      loadMatches()
    } catch (error) {
      message.error("确认失败")
    }
  }

  const handleReject = async (matchId: string) => {
    try {
      await searchService.rejectMatch(token!, matchId)
      message.success("匹配已拒绝")
      loadMatches()
    } catch (error) {
      message.error("拒绝失败")
    }
  }

  const handleViewDetail = (match: MatchResult) => {
    setSelectedMatch(match)
    setDetailVisible(true)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "#52c41a"
    if (score >= 60) return "#faad14"
    return "#ff4d4f"
  }

  const pendingMatches = matches.filter((m) => m.status === MatchStatus.PENDING)
  const confirmedMatches = matches.filter((m) => m.status === MatchStatus.CONFIRMED)

  return (
    <Modal
      title={
        <Space>
          <HeartOutlined />
          智能匹配中心
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div>
        {pendingMatches.length > 0 && (
          <Alert
            message={`发现 ${pendingMatches.length} 个可能的匹配`}
            description="系统根据物品特征、地点、时间等信息为您找到了可能的匹配，请确认是否为同一物品。"
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        <Card title="待确认匹配" style={{ marginBottom: 16 }}>
          <List
            loading={loading}
            dataSource={pendingMatches}
            renderItem={(match) => (
              <List.Item
                actions={[
                  <Button key="view" icon={<EyeOutlined />} onClick={() => handleViewDetail(match)}>
                    查看详情
                  </Button>,
                  <Button key="confirm" type="primary" icon={<CheckOutlined />} onClick={() => handleConfirm(match.id)}>
                    确认匹配
                  </Button>,
                  <Button key="reject" danger icon={<CloseOutlined />} onClick={() => handleReject(match.id)}>
                    不是同一物品
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{match.lostItem.title}</Text>
                      <Text type="secondary">←→</Text>
                      <Text strong>{match.foundItem.title}</Text>
                      <Tag color={getMatchScoreColor(match.matchScore)}>匹配度 {match.matchScore}%</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Progress
                        percent={match.matchScore}
                        size="small"
                        strokeColor={getMatchScoreColor(match.matchScore)}
                        style={{ marginBottom: 8 }}
                      />
                      <Space wrap>
                        {match.matchReasons.map((reason, index) => (
                          <Tag key={index} size="small">
                            {reason}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card title="已确认匹配">
          <List
            dataSource={confirmedMatches}
            renderItem={(match) => (
              <List.Item
                actions={[
                  <Button key="view" icon={<EyeOutlined />} onClick={() => handleViewDetail(match)}>
                    查看详情
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{match.lostItem.title}</Text>
                      <Text type="secondary">←→</Text>
                      <Text strong>{match.foundItem.title}</Text>
                      <Tag color="green">{MATCH_STATUS_LABELS[match.status]}</Tag>
                    </Space>
                  }
                  description={`确认时间：${new Date(match.createdAt).toLocaleString()}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 匹配详情模态框 */}
      <Modal title="匹配详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={900}>
        {selectedMatch && (
          <div>
            <Card title="丢失物品" style={{ marginBottom: 16 }}>
              <Paragraph>
                <strong>标题：</strong>
                {selectedMatch.lostItem.title}
              </Paragraph>
              <Paragraph>
                <strong>描述：</strong>
                {selectedMatch.lostItem.description}
              </Paragraph>
              <Paragraph>
                <strong>地点：</strong>
                {selectedMatch.lostItem.location.address}
              </Paragraph>
              <Paragraph>
                <strong>时间：</strong>
                {new Date(selectedMatch.lostItem.createdAt).toLocaleString()}
              </Paragraph>
            </Card>

            <Card title="找到物品" style={{ marginBottom: 16 }}>
              <Paragraph>
                <strong>标题：</strong>
                {selectedMatch.foundItem.title}
              </Paragraph>
              <Paragraph>
                <strong>描述：</strong>
                {selectedMatch.foundItem.description}
              </Paragraph>
              <Paragraph>
                <strong>地点：</strong>
                {selectedMatch.foundItem.location.address}
              </Paragraph>
              <Paragraph>
                <strong>时间：</strong>
                {new Date(selectedMatch.foundItem.createdAt).toLocaleString()}
              </Paragraph>
            </Card>

            <Card title="匹配分析">
              <div style={{ marginBottom: 16 }}>
                <Text strong>匹配度：</Text>
                <Progress
                  percent={selectedMatch.matchScore}
                  strokeColor={getMatchScoreColor(selectedMatch.matchScore)}
                  style={{ marginLeft: 16, width: 200 }}
                />
              </div>
              <div>
                <Text strong>匹配原因：</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedMatch.matchReasons.map((reason, index) => (
                    <Tag key={index} style={{ marginBottom: 4 }}>
                      {reason}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </Modal>
  )
}
