import React from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "首页", path: "/" },
  { name: "前端面试宝典", path: "/interview" },
  { name: "小工具", path: "/tools" },
  { name: "博客", path: "/blog" },
  { name: "简历制作", path: "/resume" },
];

const HeaderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const navHome = () => {
    navigate(navItems[0].path);
  };

  return (
    <div className="sticky w-full top-0 left-0 right-0 h-[80px] px-8 flex justify-between items-center p-4 bg-slate-900">
      <div className="text-2xl font-bold cursor-pointer" onClick={navHome}>
        前端面试宝典
      </div>
      <div className="flex items-center justify-between gap-6">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className="text-lg cursor-pointer hover:text-violet-700"
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="text-lg cursor-pointer hover:text-slate-300">登录</div>
    </div>
  );
};

export default HeaderPage;
