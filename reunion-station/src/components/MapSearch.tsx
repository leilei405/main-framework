"use client"

import { useState, useEffect } from "react"
import { Card, Button, Slider, Select, message } from "antd"
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons"

const { Option } = Select

interface MapSearchProps {
  onLocationSearch: (location: { lat: number; lng: number; radius: number }) => void
}

export default function MapSearch({ onLocationSearch }: MapSearchProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(5) // 默认5公里
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("获取位置失败:", error)
          message.warning("无法获取当前位置，请手动选择搜索区域")
        },
      )
    } else {
      message.warning("浏览器不支持地理定位")
    }
  }

  const handleLocationSearch = () => {
    if (!currentLocation) {
      message.warning("请先获取当前位置")
      return
    }

    setLoading(true)
    onLocationSearch({
      ...currentLocation,
      radius: searchRadius,
    })
    setLoading(false)
  }

  return (
    <Card title="地图搜索" size="small">
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {currentLocation ? "已获取当前位置" : "未获取位置"}
        </div>
        {!currentLocation && (
          <Button size="small" onClick={getCurrentLocation}>
            重新获取位置
          </Button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>搜索半径：{searchRadius} 公里</div>
        <Slider
          min={1}
          max={50}
          value={searchRadius}
          onChange={setSearchRadius}
          marks={{
            1: "1km",
            10: "10km",
            25: "25km",
            50: "50km",
          }}
        />
      </div>

      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleLocationSearch}
        loading={loading}
        disabled={!currentLocation}
        block
      >
        附近搜索
      </Button>

      <div style={{ marginTop: 16, fontSize: "12px", color: "#999" }}>* 基于您的当前位置搜索附近的失物招领信息</div>
    </Card>
  )
}
