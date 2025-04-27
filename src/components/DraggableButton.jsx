import { useEffect, useRef, useState } from "react";

import ResizableModal from "./ResizableModal";

function DraggableButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const mainRef = useRef(null);
  const dragDistance = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mainRef.current = document.querySelector(".main");
    // 設置初始位置在右上角
    if (mainRef.current && buttonRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPos({
        x: mainRect.right - buttonRect.width - 20, // 距離右邊 20px
        y: mainRect.top + 20, // 距離頂部 20px
      });
    }
  }, []);

  const onMouseDown = (e) => {
    if (!mainRef.current) return;

    dragging.current = true;
    dragDistance.current = { x: 0, y: 0 };
    const mainRect = mainRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();

    startPos.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onTouchStart = (e) => {
    if (!mainRef.current) return;
    e.preventDefault();

    dragging.current = true;
    dragDistance.current = { x: 0, y: 0 };
    const mainRect = mainRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const touch = e.touches[0];

    startPos.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  };

  const onMouseMove = (e) => {
    if (!dragging.current || !mainRef.current || !buttonRef.current) return;

    const mainRect = mainRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();

    let newX = e.clientX - startPos.current.x;
    let newY = e.clientY - startPos.current.y;

    // 更新拖曳距離
    dragDistance.current = {
      x: Math.abs(e.clientX - (startPos.current.x + pos.x)),
      y: Math.abs(e.clientY - (startPos.current.y + pos.y)),
    };

    // 限制在 main 容器的視窗範圍內
    newX = Math.max(
      mainRect.left,
      Math.min(newX, mainRect.right - buttonRect.width)
    );
    newY = Math.max(
      mainRect.top,
      Math.min(newY, mainRect.bottom - buttonRect.height)
    );

    setPos({ x: newX, y: newY });
  };

  const onTouchMove = (e) => {
    if (!dragging.current || !mainRef.current || !buttonRef.current) return;
    e.preventDefault();

    const mainRect = mainRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const touch = e.touches[0];

    let newX = touch.clientX - startPos.current.x;
    let newY = touch.clientY - startPos.current.y;

    // 更新拖曳距離
    dragDistance.current = {
      x: Math.abs(touch.clientX - (startPos.current.x + pos.x)),
      y: Math.abs(touch.clientY - (startPos.current.y + pos.y)),
    };

    // 限制在 main 容器的視窗範圍內
    newX = Math.max(
      mainRect.left,
      Math.min(newX, mainRect.right - buttonRect.width)
    );
    newY = Math.max(
      mainRect.top,
      Math.min(newY, mainRect.bottom - buttonRect.height)
    );

    setPos({ x: newX, y: newY });
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onTouchEnd = () => {
    dragging.current = false;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  const handleClick = (e) => {
    // 如果拖曳距離超過 5 像素，則不觸發點擊事件
    if (dragDistance.current.x > 5 || dragDistance.current.y > 5) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={`
          area-btn rounded-full w-9 h-9 bg-green-400 flex justify-center items-center text-2xl font-bold
          fixed opacity-50 text-orange-400 shadow-lg cursor-move
        `}
        style={{
          left: pos.x,
          top: pos.y,
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleClick}
      >
        +
      </button>
      <ResizableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div></div>
      </ResizableModal>
    </>
  );
}

export default DraggableButton;
