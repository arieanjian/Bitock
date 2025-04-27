import React, { useEffect, useRef, useState } from "react";

const ResizableModal = ({ isOpen, onClose, children }) => {
  const container = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(() => {
    // 根據視窗寬度設置初始大小
    return window.innerWidth >= 1440
      ? { width: window.innerWidth * 0.7, height: window.innerHeight * 0.4 }
      : // : { width: 400, height: 300 };
        { width: window.innerWidth * 0.9, height: window.innerHeight * 0.9 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const modalRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1440) {
        setSize({
          width: window.innerWidth * 0.7,
          height: window.innerHeight * 0.4,
        });
      } else {
        setSize({
          width: window.innerWidth * 0.7,
          height: window.innerHeight * 0.4,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen || !container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: container.current.id,
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Asia/Taipei",
          theme: "light",
          style: "1",
          locale: "zh_TW",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          studies: [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies",
            "MACD@tv-basicstudies",
          ],
          width: "100%",
          height: "100%",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [isOpen]);

  // 初始化位置到畫面中間
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        x: (windowWidth - size.width) / 2,
        y: (windowHeight - size.height) / 2,
      });
    }
  }, [isOpen]);

  const getClientPosition = (e) => {
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleStart = (e, type, edge = null) => {
    e.preventDefault();
    const pos = getClientPosition(e);

    if (type === "drag") {
      setIsDragging(true);
      dragStartPos.current = {
        x: pos.x - position.x,
        y: pos.y - position.y,
      };
    } else if (type === "resize") {
      setIsResizing(true);
      setResizeEdge(edge);
      initialSize.current = { ...size };
      dragStartPos.current = { x: pos.x, y: pos.y };
    }
  };

  const handleMove = (e) => {
    e.preventDefault();
    const pos = getClientPosition(e);

    if (isDragging) {
      let newX = pos.x - dragStartPos.current.x;
      let newY = pos.y - dragStartPos.current.y;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      newX = Math.max(0, Math.min(newX, windowWidth - size.width));
      newY = Math.max(0, Math.min(newY, windowHeight - size.height));

      setPosition({
        x: newX,
        y: newY,
      });
    } else if (isResizing) {
      const deltaX = pos.x - dragStartPos.current.x;
      const deltaY = pos.y - dragStartPos.current.y;

      let newSize = { ...size };
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      switch (resizeEdge) {
        case "right":
          newSize.width = Math.min(
            Math.max(200, initialSize.current.width + deltaX),
            windowWidth - position.x
          );
          break;
        case "bottom":
          newSize.height = Math.min(
            Math.max(200, initialSize.current.height + deltaY),
            windowHeight - position.y
          );
          break;
        case "left":
          const newWidth = Math.max(200, initialSize.current.width - deltaX);
          const maxLeftX = position.x + size.width - 200;
          const newX = Math.min(position.x + deltaX, maxLeftX);
          setPosition((prev) => ({ ...prev, x: newX }));
          newSize.width = size.width - (newX - position.x);
          break;
        case "top":
          const newHeight = Math.max(200, initialSize.current.height - deltaY);
          const maxTopY = position.y + size.height - 200;
          const newY = Math.min(position.y + deltaY, maxTopY);
          setPosition((prev) => ({ ...prev, y: newY }));
          newSize.height = size.height - (newY - position.y);
          break;
        default:
          break;
      }

      setSize(newSize);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isOpen, isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200 bg-gray-100"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? "grabbing" : "default",
        touchAction: "none", // 防止觸控事件的預設行為
      }}
    >
      {/* 標題欄 - 用於拖曳 */}
      <div
        className="h-8 bg-gray-100 rounded-t-lg cursor-grab flex items-center px-4"
        onMouseDown={(e) => handleStart(e, "drag")}
        onTouchStart={(e) => handleStart(e, "drag")}
      >
        <div className="flex-1" />
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* 內容區域 */}
      <div className="h-[calc(100%-2rem)] overflow-hidden">
        <div
          id="tradingview_widget"
          ref={container}
          className="w-full h-full"
        />
      </div>

      {/* 調整大小的邊框 */}
      <div
        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleStart(e, "resize", "left")}
        onTouchStart={(e) => handleStart(e, "resize", "left")}
      />
      <div
        className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleStart(e, "resize", "right")}
        onTouchStart={(e) => handleStart(e, "resize", "right")}
      />
      <div
        className="absolute top-0 left-0 h-2 w-full cursor-ns-resize"
        onMouseDown={(e) => handleStart(e, "resize", "top")}
        onTouchStart={(e) => handleStart(e, "resize", "top")}
      />
      <div
        className="absolute bottom-0 left-0 h-2 w-full cursor-ns-resize"
        onMouseDown={(e) => handleStart(e, "resize", "bottom")}
        onTouchStart={(e) => handleStart(e, "resize", "bottom")}
      />
    </div>
  );
};

export default ResizableModal;
