import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import sparklesOutline from "../../../assets/sparkles-outline.png";

const Hero: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mt-16 flex items-center justify-center p-[5px_12px] border-solid border-2 border-purple-500 rounded-3xl bg-purple-400 cursor-pointer">
        <img className="w-4 h-4" src={sparklesOutline} />
        <div className="text-lg ml-2 text-white">
          全新前端学习平台 为前端工程师打造的知识宝库
        </div>
      </div>

      <div className="flex items-center justify-center mt-4">
        <div className="text-5xl font-bold text-white">前端开发者的</div>
        <div className="ml-1 bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-5xl font-bold text-transparent">
          知识宝库
        </div>
      </div>

      <div className="text-lg ml-2 text-gray-500 mt-6">
        系统化的面试题库、实用的开发工具、深度的技术文章
        助你在前端开发道路上不断进步
      </div>

      <div className="flex items-center justify-center">
        <div className="z-2 group flex items-center justify-center mt-8 p-[5px_12px] rounded-xl bg-purple-400 cursor-pointer hover:bg-purple-500 hover:scale-105 transition-all duration-300">
          <div className="text-lg ml-2 text-white">开始学习</div>
          <ArrowRightOutlined
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: "white", marginLeft: "4px" }}
          />
        </div>

        <div className="z-2 text-lg ml-6 mt-8 hover:bg-purple-500 hover:rounded-xl hover:p-[5px_12px] hover:scale-105 transition-all duration-300 text-white cursor-pointer">
          探索工具
        </div>
      </div>
    </div>
  );
};

export default Hero;
