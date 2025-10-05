"use client"

import { Header } from "@/components/header"
import { Button, Card, Statistic } from "antd"
import { ArrowRightOutlined, CodeOutlined, ToolOutlined, BookOutlined, StarOutlined } from "@ant-design/icons"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: <CodeOutlined style={{ fontSize: 24 }} />,
      title: "前端面试宝典",
      description: "涵盖 HTML、CSS、JavaScript、TypeScript、React、Node.js、Nest 等全栈技术栈",
      href: "/interview",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <ToolOutlined style={{ fontSize: 24 }} />,
      title: "开发小工具",
      description: "JSON 格式化、JSON 转可视化依赖图、代码美化等实用工具",
      href: "/tools",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <BookOutlined style={{ fontSize: 24 }} />,
      title: "技术博客",
      description: "分享前端开发经验、最佳实践和技术洞察",
      href: "/blog",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-float delay-300" />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400 animate-fade-in-up opacity-0">
              <StarOutlined />
              <span>全新前端学习平台</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white text-balance sm:text-6xl md:text-7xl animate-fade-in-up opacity-0 delay-100">
              前端开发者的
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                成长宝典
              </span>
            </h1>

            <p className="mb-8 text-lg text-gray-400 text-balance md:text-xl animate-fade-in-up opacity-0 delay-200">
              系统化的面试题库、实用的开发工具、深度的技术文章
              <br />
              助你在前端开发道路上不断进步
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up opacity-0 delay-300">
              <Link href="/interview">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
                  开始学习
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="large">探索工具</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">强大的功能特性</h2>
            <p className="text-lg text-gray-400">为前端开发者量身打造的学习和工具平台</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Link key={feature.title} href={feature.href}>
                <Card
                  hoverable
                  className="h-full animate-fade-in-up opacity-0 group"
                  style={{
                    animationDelay: `${0.4 + index * 0.1}s`,
                    background: "rgba(20, 20, 20, 0.5)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white transition-transform group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-400">{feature.description}</p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                    了解更多
                    <ArrowRightOutlined />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { label: "面试题目", value: 500 },
              { label: "开发工具", value: 10 },
              { label: "技术文章", value: 100 },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <Statistic
                  value={stat.value}
                  suffix="+"
                  valueStyle={{ color: "#3b82f6", fontSize: 36, fontWeight: "bold" }}
                />
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            准备好开始你的前端之旅了吗？
          </h2>
          <p className="mb-8 text-lg text-gray-400 text-balance">加入我们，获取最新的前端技术资讯和学习资源</p>
          <Link href="/interview">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
              立即开始
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
