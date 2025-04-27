import { useEffect, useRef, useState } from "react";

import ChatMessage from "./components/ChatMessage";
import DraggableButton from "./components/DraggableButton";
import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Sidebar from "./components/Sidebar";

function App() {
  const messagesRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "你好！我是 AI 助手，有什麼我可以幫你的嗎？",
    },
    {
      role: "user",
      content: "今日2330.TW 的股價是多少？",
    },
    {
      role: "assistant",
      content: "今日股價是 XXX 元, 漲幅是 XXX%",
    },
    {
      role: "user",
      content: "你們的app有什麼功能？",
    },
    {
      role: "assistant",
      content: "你好！目前提供 台股 幣圈 台指期 選擇權 的進出點位建議",
    },
    {
      role: "user",
      content: "跟著你們買一定賺錢嗎？",
    },
    {
      role: "assistant",
      content:
        "你好！我們有專業的老師提供進出場點位建議，但是不保證一定賺錢，投資有風險，入市需謹慎！！！ ",
    },
    {
      role: "user",
      content: "會員費怎麼算呢？？",
    },
    {
      role: "assistant",
      content: `期權 策略分析群 | 包月     <span style="color: red;">$3490</span> <br>
        台股 策略分析群 | 包月     <span style="color: blue;">$3490</span> <br>
        幣圈 策略分析群 | 包月     <span style="color: pink;">$3490</span> <br>
        台指期 策略分析群 | 包月     <span style="color: green;">$3490</span> <br>
        選擇權 策略分析群 | 包月     <span style="color: orange;">$3490</span> <br>
        `,
    },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = (message) => {
    setMessages([...messages, { role: "user", content: message }]);
    // 這裡可以添加與 AI 的實際對話邏輯
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header setSidebarOpen={setSidebarOpen} />
      {/* Sidebar */}
      <section className="flex-1 flex overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* 主要內容區域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={messagesRef}
            // className="main bg-red-100 relative w-full xl:w-[70vw] h-[calc(100vh-180px)] py-2 overflow-y-auto mx-auto px-2 flex gap-2 flex-col"
            className="main bg-red-100 relative w-full xl:w-[70vw] h-[50vh] py-2 overflow-y-auto mx-auto px-2 flex gap-2 flex-col"
          >
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <DraggableButton />
          </div>
          <div className="flex-shrink-0">
            <InputArea onSendMessage={handleSendMessage} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
