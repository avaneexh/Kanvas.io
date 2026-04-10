import { useCanvasStore } from "../store/canvasStore";
import { Undo2, Redo2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import LoginSignup from "./LoginSignup";

const Topbar = () => {
  const tool = useCanvasStore((s) => s.tool);
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);

  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);

  const past = useCanvasStore((s) => s.past);
  const future = useCanvasStore((s) => s.future);

  const elements = useCanvasStore((s) => s.elements);

  // 🔐 Auth
  const { authUser, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  const handleDownload = () => {
    const data = JSON.stringify(elements, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "kanvas.json";
    a.click();
  };

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6 relative">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="font-bold text-lg text-blue-600">
          Kanvas.io
        </div>
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>

        <div className="text-sm text-gray-600">
          Tool: <span className="font-medium">{tool}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 items-center">
        
        {/* Undo */}
        <button
          onClick={undo}
          disabled={!past.length}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"
        >
          <Undo2 size={18} />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!future.length}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-40"
        >
          <Redo2 size={18} />
        </button>

        {/* 🔐 AUTH BUTTON */}
        {authUser ? (
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-black text-white text-sm hover:bg-black/90"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="px-3 py-1 rounded border border-black text-sm hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        )}
      </div>

      {/* 🔥 LOGIN POPUP */}
      {showAuth && <LoginSignup onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Topbar;