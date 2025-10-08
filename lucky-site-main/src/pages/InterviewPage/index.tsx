import React, { useState } from "react";
import LeftCategory from "./LeftCategory";
import ContentCategory from "./ContentCategory";
import List from "./List";

const InterviewPage: React.FC = () => {
  // 创建共享的选中分类状态
  const [selectedCategory, setSelectedCategory] =
    useState<string>("JavaScript");

  // 处理分类选择变化
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* 主内容区 */}
      <div className="z-10 flex max-w-7xl mx-auto">
        {/* 左侧导航栏 */}
        <LeftCategory
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 右侧内容区 */}
        <div className="flex-1 p-6">
          {/* 内容区导航 */}
          <ContentCategory
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* 搜索框 */}
          <div className="mb-8">
            <div className="relative z-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="搜索面试题目..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          {/* 题目列表 */}
          <List />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
