import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 定义面试题数据类型
interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: "简单" | "中等" | "困难";
  answerContent?: string;
}

const List: React.FC = () => {
  const navigate = useNavigate();
  // 模拟的面试题数据
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const questionsPerPage = 4;

  // 模拟获取数据
  const fetchQuestions = (pageNum: number) => {
    setLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      const mockQuestions: Question[] = [
        {
          id: `q${(pageNum - 1) * questionsPerPage + 1}`,
          question: "什么是闭包？请举例说明",
          category: "JavaScript",
          difficulty: "中等",
          answerContent:
            "闭包是指函数可以访问其词法作用域外的变量，即使函数在其定义作用域之外执行。例如：\n\nfunction outer() {\n  const count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}\n\nconst increment = outer();\nconsole.log(increment()); // 输出: 1\nconsole.log(increment()); // 输出: 2",
        },
        {
          id: `q${(pageNum - 1) * questionsPerPage + 2}`,
          question: "React Hooks 的使用规则",
          category: "React",
          difficulty: "简单",
          answerContent:
            "React Hooks 的使用规则：\n1. 只能在函数组件的顶层调用 Hook\n2. 不要在循环、条件或嵌套函数中调用 Hook\n3. 只在函数组件或自定义 Hook 中调用 Hook\n4. useEffect 的依赖项数组必须包含所有在 effect 中使用的外部变量",
        },
        {
          id: `q${(pageNum - 1) * questionsPerPage + 3}`,
          question: "CSS盒模型详解",
          category: "CSS",
          difficulty: "简单",
          answerContent:
            "CSS盒模型由内到外包括：\n1. Content（内容区域）：显示实际内容的区域\n2. Padding（内边距）：内容区域与边框之间的空间\n3. Border（边框）：围绕内容和内边距的边界\n4. Margin（外边距）：元素与其他元素之间的空间\n\n盒模型有两种模式：标准盒模型和IE盒模型，可以通过box-sizing属性控制。",
        },
        {
          id: `q${(pageNum - 1) * questionsPerPage + 4}`,
          question: "Promise 和 async/await的区别",
          category: "JavaScript",
          difficulty: "中等",
          answerContent:
            "Promise 和 async/await的区别：\n\nPromise是ES6引入的异步编程解决方案，而async/await是ES2017引入的基于Promise的语法糖，使异步代码看起来更像同步代码。\n\n1. Promise使用then/catch链处理异步操作，而async/await使用try/catch处理错误\n2. async/await使代码结构更清晰，可读性更高\n3. 两者本质上是相同的，async函数返回的仍然是Promise对象",
        },
      ];

      // 模拟只有前5页有数据
      if (pageNum > 5) {
        setHasMore(false);
      } else {
        setQuestions((prev) => [...prev, ...mockQuestions]);
        setPage(pageNum);
      }
      setLoading(false);
    }, 800);
  };

  // 初始加载数据
  useEffect(() => {
    fetchQuestions(1);
  }, []);

  // 处理加载更多
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchQuestions(page + 1);
    }
  };

  // 处理题目点击事件
  const handleQuestionClick = (questionId: string) => {
    navigate(`/interview/${questionId}`);
  };

  // 获取难度对应的颜色和样式
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "简单":
        return "text-green-500 bg-green-500/10";
      case "中等":
        return "text-yellow-500 bg-yellow-500/10";
      case "困难":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  // 获取分类对应的颜色
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      JavaScript: "text-yellow-400 bg-yellow-900/20",
      React: "text-cyan-400 bg-cyan-900/20",
      CSS: "text-blue-400 bg-blue-900/20",
      HTML: "text-orange-400 bg-orange-900/20",
      TypeScript: "text-blue-400 bg-blue-900/20",
      Vue: "text-green-400 bg-green-900/20",
      "Node.js": "text-green-400 bg-green-900/20",
      默认: "text-gray-400 bg-gray-900/20",
    };
    return colorMap[category] || colorMap["默认"];
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">最近更新</h2>
      <div className="relative space-y-4 z-10">
        {questions.map((question) => (
          <div
            key={question.id}
            onClick={() => handleQuestionClick(question.id)}
            className="flex justify-between items-center p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-all duration-200 cursor-pointer hover:border-purple-500/50 group hover:-translate-y-1"
          >
            {/* left */}
            <div className="flex flex-col justify-between">
              <span className="text-white font-medium transition-colors duration-200 group-hover:text-purple-300">
                {question.question}
              </span>
              <div className="mt-2">
                <span
                  className={`text-xs ${getCategoryColor(
                    question.category
                  )} px-2 py-1 rounded-full`}
                >
                  {question.category}
                </span>
                <span
                  className={`text-xs ${getDifficultyStyle(
                    question.difficulty
                  )} px-2 py-1 ml-2 rounded-full`}
                >
                  {question.difficulty}
                </span>
              </div>
            </div>
            {/* right arrow */}
            <>
              <svg
                className="w-5 h-5 text-gray-500 transition-colors group-hover:text-white flex items-center justify-center"
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
            </>
          </div>
        ))}

        {/* 加载更多按钮 */}
        <div className="text-center mt-6">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={`px-6 py-2 rounded-lg border ${
                loading
                  ? "border-gray-700 text-gray-500 cursor-not-allowed"
                  : "border-purple-500 text-purple-400 hover:bg-purple-900/20 transition-colors"
              }`}
            >
              {loading ? "加载中..." : "加载更多"}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">没有更多题目了</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
