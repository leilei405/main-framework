import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: "简单" | "中等" | "困难";
  answerContent?: string;
}

const AnswerContent: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 模拟获取题目详情
  useEffect(() => {
    if (!questionId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟的mock数据
      const mockQuestions: Record<string, Question> = {
        q1: {
          id: "q1",
          question: "什么是闭包？请举例说明",
          category: "JavaScript",
          difficulty: "中等",
          answerContent: `# 闭包的概念与示例

## 什么是闭包？

闭包是指**函数可以访问其词法作用域外的变量**，即使函数在其定义作用域之外执行。换句话说，闭包让函数能够"记住"并访问它被创建时的词法环境。

## 闭包的特点

- 函数嵌套在另一个函数内部
- 内部函数引用了外部函数的变量
- 外部函数返回内部函数

## 闭包的示例

### 基本示例

\`\`\`javascript
function outer() {
  const count = 0;  // 外部函数的局部变量
  
  // 内部函数形成闭包
  function inner() {
    count++;  // 访问外部函数的变量
    return count;
  }
  
  return inner;  // 返回内部函数
}

const increment = outer();  // increment现在是一个闭包
console.log(increment());  // 输出: 1
console.log(increment());  // 输出: 2
console.log(increment());  // 输出: 3
\`\`\`

### 实际应用示例：计数器

\`\`\`javascript
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment());  // 输出: 11
console.log(counter.increment());  // 输出: 12
console.log(counter.decrement());  // 输出: 11
console.log(counter.getCount());   // 输出: 11
\`\`\`

## 闭包的用途

1. **封装数据**：创建私有变量
2. **实现模块模式**：组织代码
3. **延迟执行**：如定时器、回调函数
4. **函数柯里化**

## 注意事项

过度使用闭包可能导致内存泄漏，因为闭包会持有外部函数的作用域，使其不会被垃圾回收。

---

通过以上示例可以看出，闭包是JavaScript中一个强大而重要的特性，它允许函数访问并操作其词法作用域外的数据。`,
        },
        q2: {
          id: "q2",
          question: "React Hooks 的使用规则",
          category: "React",
          difficulty: "简单",
          answerContent:
            "React Hooks 的使用规则：\n1. 只能在函数组件的顶层调用 Hook\n2. 不要在循环、条件或嵌套函数中调用 Hook\n3. 只在函数组件或自定义 Hook 中调用 Hook\n4. useEffect 的依赖项数组必须包含所有在 effect 中使用的外部变量",
        },
        q3: {
          id: "q3",
          question: "CSS盒模型详解",
          category: "CSS",
          difficulty: "简单",
          answerContent:
            "CSS盒模型由内到外包括：\n1. Content（内容区域）：显示实际内容的区域\n2. Padding（内边距）：内容区域与边框之间的空间\n3. Border（边框）：围绕内容和内边距的边界\n4. Margin（外边距）：元素与其他元素之间的空间\n\n盒模型有两种模式：标准盒模型和IE盒模型，可以通过box-sizing属性控制。",
        },
        q4: {
          id: "q4",
          question: "Promise 和 async/await的区别",
          category: "JavaScript",
          difficulty: "中等",
          answerContent:
            "Promise 和 async/await的区别：\n\nPromise是ES6引入的异步编程解决方案，而async/await是ES2017引入的基于Promise的语法糖，使异步代码看起来更像同步代码。\n\n1. Promise使用then/catch链处理异步操作，而async/await使用try/catch处理错误\n2. async/await使代码结构更清晰，可读性更高\n3. 两者本质上是相同的，async函数返回的仍然是Promise对象",
        },
      };

      // 如果找不到对应的题目，使用默认mock数据
      const foundQuestion = mockQuestions[questionId] || {
        id: questionId,
        question: "什么是JavaScript？",
        category: "JavaScript",
        difficulty: "简单",
        answerContent:
          "JavaScript是一种高级的、解释执行的编程语言。它是网页开发的核心技术之一，主要用于为网页添加交互功能。JavaScript是一种多范式语言，支持面向对象编程、命令式编程和函数式编程。",
      };

      setQuestion(foundQuestion);
      setLoading(false);
    }, 500);
  }, [questionId]);

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

  // 格式化答案内容，将换行符转换为<br>标签
  const formatAnswer = (answer: string) => {
    return answer.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 返回列表
  const handleBack = () => {
    navigate("/interview");
  };

  return (
    <div className=" bg-gray-950 text-gray-200 flex flex-col p-6">
      {/* <button
        onClick={handleBack}
        className="mb-6 flex items-center text-purple-400 hover:text-purple-300"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回列表
      </button> */}

      {question && (
        <div className="z-5 bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
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
                )} px-2 py-1 rounded-full`}
              >
                {question.difficulty}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-6">
              {question.question}
            </h1>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">参考答案</h2>
            <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
              {/* 使用包装div应用样式 */}
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                  {question.answerContent || "暂无答案"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerContent;
