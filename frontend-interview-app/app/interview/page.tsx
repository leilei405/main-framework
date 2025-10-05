"use client"

import { Header } from "@/components/header"
import { Card, Input, Tag, Layout } from "antd"
import { SearchOutlined, RightOutlined } from "@ant-design/icons"
import { useState } from "react"

const { Sider, Content } = Layout

export default function InterviewPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: "html", name: "HTML", count: 45, color: "#f97316" },
    { id: "css", name: "CSS", count: 52, color: "#3b82f6" },
    { id: "javascript", name: "JavaScript", count: 120, color: "#eab308" },
    { id: "typescript", name: "TypeScript", count: 68, color: "#2563eb" },
    { id: "react", name: "React", count: 85, color: "#06b6d4" },
    { id: "vue", name: "Vue", count: 72, color: "#10b981" },
    { id: "nodejs", name: "Node.js", count: 56, color: "#16a34a" },
    { id: "nest", name: "Nest.js", count: 42, color: "#ef4444" },
    { id: "webpack", name: "Webpack", count: 38, color: "#60a5fa" },
    { id: "performance", name: "性能优化", count: 45, color: "#a855f7" },
    { id: "security", name: "安全", count: 32, color: "#dc2626" },
    { id: "algorithm", name: "算法", count: 95, color: "#ec4899" },
  ]

  const recentQuestions = [
    { id: 1, title: "什么是闭包？请举例说明", category: "JavaScript", difficulty: "中等", difficultyColor: "warning" },
    { id: 2, title: "React Hooks 的使用规则", category: "React", difficulty: "简单", difficultyColor: "success" },
    { id: 3, title: "CSS 盒模型详解", category: "CSS", difficulty: "简单", difficultyColor: "success" },
    {
      id: 4,
      title: "Promise 和 async/await 的区别",
      category: "JavaScript",
      difficulty: "中等",
      difficultyColor: "warning",
    },
    { id: 5, title: "Vue3 Composition API 优势", category: "Vue", difficulty: "中等", difficultyColor: "warning" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <Layout className="container mx-auto px-4 py-8" style={{ background: "transparent" }}>
        <Layout style={{ background: "transparent" }}>
          {/* Sidebar */}
          <Sider
            width={256}
            className="hidden lg:block mr-6"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="p-4">
              <h3 className="mb-4 font-semibold text-white">面试题目导航</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Sider>

          {/* Main Content */}
          <Content className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-white">前端面试宝典</h1>
              <Input
                size="large"
                placeholder="搜索面试题目..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories Grid */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white">类目导航</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                  <Card
                    key={category.id}
                    hoverable
                    className="animate-fade-in-up opacity-0 group"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      background: "rgba(20, 20, 20, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-400">{category.count} 道题目</p>
                        </div>
                      </div>
                      <RightOutlined className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Questions */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">最近更新</h2>
              <div className="space-y-3">
                {recentQuestions.map((question, index) => (
                  <Card
                    key={question.id}
                    hoverable
                    className="animate-fade-in-up opacity-0 group"
                    style={{
                      animationDelay: `${0.6 + index * 0.05}s`,
                      background: "rgba(20, 20, 20, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                          {question.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Tag color="blue">{question.category}</Tag>
                          <Tag color={question.difficultyColor}>{question.difficulty}</Tag>
                        </div>
                      </div>
                      <RightOutlined className="shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Content>

          {/* Right Sidebar - Tools */}
          <Sider
            width={192}
            className="hidden xl:block ml-6"
            style={{
              background: "rgba(20, 20, 20, 0.5)",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="p-4">
              <h3 className="mb-4 font-semibold text-sm text-white">工具栏</h3>
              <div className="space-y-2">
                {["收藏夹", "学习进度", "错题本", "笔记"].map((tool) => (
                  <button
                    key={tool}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 text-gray-400 hover:text-white"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </Sider>
        </Layout>
      </Layout>
    </div>
  )
}
