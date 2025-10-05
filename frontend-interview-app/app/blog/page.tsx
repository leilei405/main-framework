"use client"

import { Header } from "@/components/header"
import { Card, Input, Tag, Layout } from "antd"
import { SearchOutlined, CalendarOutlined, ClockCircleOutlined, TagOutlined } from "@ant-design/icons"
import { useState } from "react"

const { Sider, Content } = Layout

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: "all", name: "全部", count: 156 },
    { id: "javascript", name: "JavaScript", count: 45 },
    { id: "react", name: "React", count: 38 },
    { id: "css", name: "CSS", count: 28 },
    { id: "performance", name: "性能优化", count: 22 },
    { id: "architecture", name: "架构设计", count: 15 },
    { id: "tools", name: "工具推荐", count: 8 },
  ]

  const posts = [
    {
      id: 1,
      title: "深入理解 React 18 并发特性",
      excerpt: "探索 React 18 带来的并发渲染、自动批处理和 Suspense 等新特性，了解如何在实际项目中应用这些特性...",
      category: "React",
      date: "2024-01-15",
      readTime: "8 分钟",
      tags: ["React", "Performance"],
    },
    {
      id: 2,
      title: "CSS Grid 布局完全指南",
      excerpt: "从基础到高级，全面掌握 CSS Grid 布局系统，包括网格容器、网格项、对齐方式等核心概念...",
      category: "CSS",
      date: "2024-01-12",
      readTime: "12 分钟",
      tags: ["CSS", "Layout"],
    },
    {
      id: 3,
      title: "JavaScript 性能优化最佳实践",
      excerpt: "分享在大型项目中积累的 JavaScript 性能优化经验，包括代码分割、懒加载、缓存策略等...",
      category: "JavaScript",
      date: "2024-01-10",
      readTime: "10 分钟",
      tags: ["JavaScript", "Performance"],
    },
    {
      id: 4,
      title: "前端微前端架构实践",
      excerpt: "介绍微前端架构的设计理念和实现方案，以及在实际项目中的应用经验和踩坑记录...",
      category: "架构设计",
      date: "2024-01-08",
      readTime: "15 分钟",
      tags: ["Architecture", "Micro Frontend"],
    },
    {
      id: 5,
      title: "TypeScript 高级类型技巧",
      excerpt: "深入探讨 TypeScript 的高级类型系统，包括条件类型、映射类型、模板字面量类型等...",
      category: "JavaScript",
      date: "2024-01-05",
      readTime: "11 分钟",
      tags: ["TypeScript", "Advanced"],
    },
    {
      id: 6,
      title: "Vite 构建工具深度解析",
      excerpt: "了解 Vite 的工作原理、配置优化和插件开发，提升前端项目的开发体验和构建效率...",
      category: "工具推荐",
      date: "2024-01-03",
      readTime: "9 分钟",
      tags: ["Vite", "Build Tools"],
    },
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
              <h3 className="mb-4 font-semibold text-white">文章分类</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white"
                  >
                    <span>{category.name}</span>
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
              <h1 className="mb-4 text-3xl font-bold text-white">技术博客</h1>
              <Input
                size="large"
                placeholder="搜索文章..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  hoverable
                  className="animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    background: "rgba(20, 20, 20, 0.5)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <Tag color="blue">{post.category}</Tag>
                    <div className="flex items-center gap-1">
                      <CalendarOutlined />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="mb-2 text-xl font-semibold text-white hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="mb-4 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center gap-2">
                    <TagOutlined className="text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="rounded-lg border border-white/10 px-6 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-blue-500 hover:text-blue-400">
                加载更多
              </button>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}
