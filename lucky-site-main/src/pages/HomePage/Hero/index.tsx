import React from "react";
import sparklesOutline from "../../../assets/sparkles-outline.png";

const Hero: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="mt-16 flex items-center justify-center w-fit p-[5px_12px] border-solid border-2 border-purple-500 rounded-3xl bg-purple-400 cursor-pointer">
        <img className="w-4 h-4" src={sparklesOutline} />
        <div className="text-lg ml-2 text-white">
          全新前端学习平台 为前端工程师打造的知识宝库
        </div>
      </div>
    </div>
  );
};

export default Hero;
