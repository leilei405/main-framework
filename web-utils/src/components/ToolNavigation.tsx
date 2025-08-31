import React from "react";
import "../styles/ToolNavigation.css";

interface ToolNavigationProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const ToolNavigation: React.FC<ToolNavigationProps> = ({
  activeTool,
  onToolChange,
}) => {
  const tools = [
    { id: "json-parser", name: "JSON解析器" },
    { id: "timestamp-converter", name: "时间戳转换" },
    { id: "json-to-ts", name: "JSON转TS类型" },
  ];

  return (
    <div className="tool-navigation">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`tool-button ${activeTool === tool.id ? "active" : ""}`}
          onClick={() => onToolChange(tool.id)}
        >
          {tool.name}
        </button>
      ))}
    </div>
  );
};

export default ToolNavigation;
