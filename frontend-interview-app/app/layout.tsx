import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, theme } from "antd"
import zhCN from "antd/locale/zh_CN"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "前端面试宝典",
  description: "前端开发者的成长宝典",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AntdRegistry>
          <Suspense fallback={null}>
            <ConfigProvider
              locale={zhCN}
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorPrimary: "#3b82f6",
                  colorBgBase: "#0a0a0a",
                  colorBgContainer: "#141414",
                  colorBorder: "#262626",
                  borderRadius: 8,
                  fontSize: 14,
                },
                components: {
                  Menu: {
                    darkItemBg: "transparent",
                  },
                },
              }}
            >
              {children}
            </ConfigProvider>
          </Suspense>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  )
}
