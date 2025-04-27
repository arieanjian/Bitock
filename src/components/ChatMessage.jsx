import parse from "html-react-parser";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-3xl p-2 ${
          isUser
            ? "bg-orange-500 text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="text-md px-2">{parse(message.content)}</div>
        {/* <div className="text-md px-2">{message.content}</div> */}
      </div>
    </div>
  );
}

export default ChatMessage;
