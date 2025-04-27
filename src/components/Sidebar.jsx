import logo from "../assets/logo.png";

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* 遮罩（小於1440px時才顯示） */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          open ? "block" : "hidden"
        } xl:hidden`}
        onClick={onClose}
      />
      {/* Sidebar 主體 */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-50 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          xl:translate-x-0 xl:static xl:block xl:h-screen
        `}
        style={{ maxWidth: "100vw" }}
      >
        {/* 關閉按鈕（小螢幕才顯示） */}
        <button
          className="xl:hidden absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        {/* 這裡放原本 Sidebar 內容（去掉 logo） */}
        <div className="mb-4 mt-8 xl:mt-0">
          <button className="w-full bg-white text-gray-900 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
            新對話
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-sm text-gray-400 px-2">今天</div>
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-sm text-gray-300"
              onClick={() => alert("不給你看！")}
            >
              海灘辣妹寫真集
            </button>
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-sm text-gray-300"
              onClick={() => alert("尚未開放此功能ㄛ！")}
            >
              Bitock 葵花寶典
            </button>
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-sm text-gray-300"
              onClick={() => alert("尚未開放此功能ㄛ！")}
            >
              台股討論
            </button>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-sm text-gray-300">
            清除所有對話
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
