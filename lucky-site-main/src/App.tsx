import React from "react";
import { Garfish } from "garfish";
import "./App.css";

function App() {
  React.useEffect(() => {
    const garfish = new Garfish({
      basename: "/",
      domGetter: "#container",
      apps: [
        {
          name: "react",
          activeWhen: "/react",
          entry: "http://localhost:3333", // 子应用入口
        },
      ],
    });
    garfish.run();
  }, []);
  return (
    <div>
      <h1 className="mainTitle">
        Vite + Garfish(微前端框架) +搭建项目 + 主应用
      </h1>
      <div id="container"></div>
    </div>
  );
}

export default App;
