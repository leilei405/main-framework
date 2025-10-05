"use client"

import Link from "next/link"
import { useState } from "react"
import { Button, Drawer } from "antd"
import { MenuOutlined, CloseOutlined } from "@ant-design/icons"
import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "首页", href: "/" },
    { name: "前端面试宝典", href: "/interview" },
    { name: "小工具", href: "/tools" },
    { name: "博客", href: "/blog" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-lg text-white">
            FE
          </div>
          <span className="hidden font-bold text-xl text-white sm:inline-block">前端宝典</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors relative group ${
                pathname === item.href ? "text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-4">
          <Button type="primary" className="hidden sm:inline-flex">
            登录
          </Button>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors py-2 ${
                pathname === item.href ? "text-blue-400" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button type="primary" block className="mt-4">
            登录
          </Button>
        </nav>
      </Drawer>
    </header>
  )
}
