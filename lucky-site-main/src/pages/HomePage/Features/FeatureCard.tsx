import React from "react";
import CodeIcon from "../../../assets/code.png";
import ResumeIcon from "../../../assets/简历.png";
import BookOpenIcon from "../../../assets/BookOpen.png";
import BlogIcon from "../../../assets/用研.png";

const FeatureCard: React.FC = () => {
  const features = [
    {
      icon: BookOpenIcon,
      title: "面试宝典",
      description:
        "涵盖 HTML、CSS、JavaScript、TypeScript、React、Node.js、Nest 等全栈技术栈",
      href: "/interview",
      borderColor: "border-indigo-500",
      glowColor: "rgba(167,139,250,0.5)",
      iconGradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: CodeIcon,
      title: "开发工具",
      description: "JSON 格式化、JSON 转可视化依赖图、代码美化等实用工具",
      href: "/tools",
      borderColor: "border-cyan-500",
      glowColor: "rgba(6,182,212,0.5)",
      iconGradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BlogIcon,
      title: "技术文章",
      description:
        "分享前端开发经验、最佳实践和技术洞察、项目经验、个人成长记录",
      href: "/blog",
      borderColor: "border-emerald-500",
      glowColor: "rgba(16,185,129,0.5)",
      iconGradient: "from-green-500 to-emerald-500",
    },
    {
      icon: ResumeIcon,
      title: "简历制作",
      description:
        "提供专业的简历模板，快速展示自己的技能和经历、项目经验、个人成长记录",
      href: "/resume",
      borderColor: "border-blue-500",
      glowColor: "rgba(59,130,246,0.5)",
      iconGradient: "from-purple-900 to-purple-500", // 修改为深紫色-淡紫色渐变
    },
  ];

  return (
    <div className="z-2 container mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <a
            href={feature.href}
            key={feature.title}
            className="block"
            aria-label={`前往${feature.title}`}
          >
            <div
              className={`relative overflow-hidden p-6 rounded-lg transition-all duration-300 ease-in-out h-full
                bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-sm border border-transparent group feature-card`}
              style={{ boxShadow: `0 0 0px ${feature.glowColor}` }}
            >
              {/* 左上角图标 */}
              <div className="absolute top-4 left-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${feature.iconGradient} transition-transform duration-300 group-hover:scale-110`}
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>

              {/* 内容区域 */}
              <div className="pt-16">
                <h3 className="text-lg font-bold text-white mb-2 transition-colors duration-300 group-hover:text-purple-400">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* 了解更多链接 - 默认隐藏，hover时显示 */}
                <div className="text-teal-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  了解更多
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Hover效果 - 边框和发光 */}
              <style>{`
                .feature-card.group:hover {
                  border-color: rgb(168, 85, 247);
                  box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
                  transform: translateY(-5px);
                }
              `}</style>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;
