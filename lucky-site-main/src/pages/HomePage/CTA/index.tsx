import React from "react";
import { useNavigate } from "react-router-dom";

const CTA: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/interview");
  };
  return (
    <div className="w-full z-10 flex flex-col items-center justify-center mt-28">
      <div className="text-3xl md:text-4xl font-bold text-white mb-4">
        准备好开始你的前端之旅了吗？
      </div>
      <div className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
        加入我们，获取最新的前端技术资讯和学习资源
      </div>

      <div
        onClick={handleClick}
        className="z-2 cursor-pointer mb-16 flex items-center justify-center px-6 py-3 bg-purple-400 hover:bg-purple-500 hover:font-bold hover:scale-105 text-white font-medium rounded-lg transition-all duration-300 group"
      >
        立即开始
        <svg
          className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </div>
  );
};

export default CTA;
