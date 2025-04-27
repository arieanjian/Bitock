import { useEffect, useRef, useState } from "react";

function InputArea({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // 自動調整 textarea 高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (!textarea.value.includes("\n")) {
        // 沒有換行符號，固定 40px
        textarea.style.height = "40px";
      } else {
        // 有換行，依內容自動調整高度
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }
  };

  // 當消息內容改變時調整高度
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 pb-4 mt-1">
      <div className="bg-white rounded-[24px] shadow-[0_0_10px_rgba(0,0,0,0.1)] border border-gray-200 relative px-3 pb-3">
        {/* <form onSubmit={handleSubmit} className="relative"> */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="詢問任何問題..."
          className={`
              w-full px-3 pt-4 pb-1
              text-base placeholder-gray-300 bg-transparent
              resize-none border-0 overflow-hidden
              focus:ring-0 focus:outline-none
              `}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {/* <div className="absolute bottom-4 left-0 right-0"> */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgb(246,113,79)] text-white hover:bg-[rgba(238,76,35)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 15l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* </div> */}
        {/* </form> */}
      </div>
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">
          ChatGPT 可能會發生錯誤。請查核重要資訊。
        </p>
      </div>
    </div>
  );
}

export default InputArea;
