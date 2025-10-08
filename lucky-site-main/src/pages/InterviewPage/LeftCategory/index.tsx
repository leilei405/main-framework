import React from "react";

// 定义分类数据类型
interface Category {
  name: string;
  count: number;
  color: string;
  bgColor: string;
  badgeColor: string;
}

interface LeftCategoryProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const LeftCategory: React.FC<LeftCategoryProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  // 分类数据
  const categories: Category[] = [
    {
      name: "HTML",
      count: 46,
      color: "text-orange-500",
      bgColor: "bg-orange-900/50",
      badgeColor: "bg-[#f17313]",
    },
    {
      name: "CSS",
      count: 52,
      color: "text-blue-500",
      bgColor: "bg-blue-900/50",
      badgeColor: "bg-[#447dfc]",
    },
    {
      name: "JavaScript",
      count: 120,
      color: "text-yellow-500",
      bgColor: "bg-yellow-900/50",
      badgeColor: "bg-[#e6b313]",
    },
    {
      name: "TypeScript",
      count: 68,
      color: "text-blue-400",
      bgColor: "bg-blue-900/50",
      badgeColor: "bg-[#2d5cf2]",
    },
    {
      name: "React",
      count: 85,
      color: "text-cyan-500",
      bgColor: "bg-cyan-900/50",
      badgeColor: "bg-[#3fb5d7]",
    },
    {
      name: "Vue",
      count: 72,
      color: "text-green-500",
      bgColor: "bg-green-900/50",
      badgeColor: "bg-[#4fc65f]",
    },
    {
      name: "Node.js",
      count: 56,
      color: "text-green-600",
      bgColor: "bg-green-900/50",
      badgeColor: "bg-[#57ba45]",
    },
    {
      name: "Nest.js",
      count: 42,
      color: "text-red-500",
      bgColor: "bg-red-900/50",
      badgeColor: "bg-[#e64341]",
    },
    {
      name: "Webpack",
      count: 38,
      color: "text-blue-700",
      bgColor: "bg-blue-900/50",
      badgeColor: "bg-[#65a0fd]",
    },
    {
      name: "性能优化",
      count: 45,
      color: "text-purple-500",
      bgColor: "bg-purple-900/50",
      badgeColor: "bg-[#a14dfd]",
    },
    {
      name: "安全",
      count: 32,
      color: "text-red-600",
      bgColor: "bg-red-900/50",
      badgeColor: "bg-[#d42422]",
    },
    {
      name: "算法",
      count: 95,
      color: "text-pink-500",
      bgColor: "bg-pink-900/50",
      badgeColor: "bg-green-900",
    },
  ];

  return (
    <div className="z-2 w-64 sticky top-26 h-fit bg-gray-900/60 border-gray-800 rounded-lg border p-4">
      <h2 className="text-xl font-bold text-white mb-6">面试题导航</h2>
      <div className="space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div key={category.name}>
              <button
                onClick={() => onCategoryChange(category.name)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-500 text-gray-400 hover:text-white ${
                  isSelected ? "bg-purple-400 text-white" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-4xl ${category.badgeColor}`}
                  />
                  <span className={`font-medium ml-2`}>{category.name}</span>
                </div>

                <span className="text-xs bg-gray-800/70 text-gray-300 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftCategory;
