import React from "react";
// import { ToolOutlined } from "@ant-design/icons";
import FeatureCard from "./FeatureCard";

const Features: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-20">
      <h2 className="text-4xl font-bold text-white">核心功能</h2>
      <div className="text-lg ml-2 text-gray-500">前端开发者成长平台</div>
      <FeatureCard />
    </div>
  );
};

export default Features;
