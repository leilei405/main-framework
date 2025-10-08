import React from "react";

const Stats: React.FC = () => {
  const stats = [
    { label: "面试题目", value: "1000+" },
    { label: "开发工具", value: "10+" },
    { label: "技术文章", value: "100+" },
    { label: "简历模版", value: "100+" },
  ];

  return (
    <div className="py-12 bg-gray-900 mt-24">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/20"
          >
            <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2">
              {stat.value}
            </span>
            <span className="text-gray-300 text-sm md:text-base">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
