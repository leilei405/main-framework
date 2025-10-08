import React from "react";

// 定义分类数据类型
interface CategoryCard {
  name: string;
  count: number;
  colorClass: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

interface ContentCategoryProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ContentCategory: React.FC<ContentCategoryProps> = (props) => {
  const { selectedCategory, onCategoryChange } = props;
  // 分类卡片数据
  const categoryCards: CategoryCard[] = [
    {
      name: "HTML",
      count: 45,
      colorClass: "bg-orange-500",
      textColor: "text-orange-500",
      bgColor: "bg-orange-900/50",
      borderColor: "border-orange-500",
    },
    {
      name: "CSS",
      count: 52,
      colorClass: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-900/50",
      borderColor: "border-blue-500",
    },
    {
      name: "JavaScript",
      count: 120,
      colorClass: "bg-yellow-500",
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-900/50",
      borderColor: "border-yellow-500",
    },
    {
      name: "TypeScript",
      count: 68,
      colorClass: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-900/50",
      borderColor: "border-blue-500",
    },
    {
      name: "React",
      count: 85,
      colorClass: "bg-cyan-500",
      textColor: "text-cyan-500",
      bgColor: "bg-cyan-900/50",
      borderColor: "border-cyan-500",
    },
    {
      name: "Vue",
      count: 72,
      colorClass: "bg-green-500",
      textColor: "text-green-500",
      bgColor: "bg-green-900/50",
      borderColor: "border-green-500",
    },
    {
      name: "Node.js",
      count: 56,
      colorClass: "bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-900/50",
      borderColor: "border-green-600",
    },
    {
      name: "Nest.js",
      count: 42,
      colorClass: "bg-red-500",
      textColor: "text-red-500",
      bgColor: "bg-red-900/50",
      borderColor: "border-red-500",
    },
    {
      name: "Webpack",
      count: 38,
      colorClass: "bg-blue-700",
      textColor: "text-blue-700",
      bgColor: "bg-blue-900/50",
      borderColor: "border-blue-700",
    },
    {
      name: "性能优化",
      count: 45,
      colorClass: "bg-purple-500",
      textColor: "text-purple-500",
      bgColor: "bg-purple-900/50",
      borderColor: "border-purple-500",
    },
    {
      name: "安全",
      count: 32,
      colorClass: "bg-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-900/50",
      borderColor: "border-red-600",
    },
    {
      name: "算法",
      count: 95,
      colorClass: "bg-green-900",
      textColor: "text-pink-500",
      bgColor: "bg-pink-900/50",
      borderColor: "border-pink-500",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-x-12 gap-y-6">
        {categoryCards.map((card) => {
          // 自动截取字符串第一个字符作为图标
          const icon = card.name.charAt(0);
          const isSelected = selectedCategory === card.name;

          return (
            <div
              key={card.name}
              onClick={() => onCategoryChange(card.name)}
              className={`z-2 w-52 cursor-pointer rounded-lg bg-[#090f16] transition-all duration-300 hover:-translate-y-1 border border-gray-800 hover:border-purple-400 ${
                isSelected ? "border-purple-400" : ""
              }`}
            >
              <div className="flex items-center px-4 py-3">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-lg text-lg font-bold text-white ${card.colorClass} transition-transform duration-300 hover:scale-110`}
                >
                  {icon}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex flex-col justify-start">
                    <span
                      className={`font-medium ${
                        isSelected ? card.textColor : "text-white"
                      } transition-colors duration-300`}
                    >
                      {card.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {card.count}道题目
                    </span>
                  </div>
                </div>
                <div className="ml-2 text-cyan-400 transition-transform duration-300 hover:translate-x-1">
                  <svg
                    className="w-5 h-5 text-gray-500 transition-colors hover:text-white flex items-center justify-center"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentCategory;
