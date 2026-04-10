import { useCanvasStore } from "../store/canvasStore";
import { Undo2, Redo2 } from "lucide-react";

const Topbar = () => {
  const tool = useCanvasStore((s) => s.tool);
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);

  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);

  const past = useCanvasStore((s) => s.past);
  const future = useCanvasStore((s) => s.future);

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      
      <div className="font-semibold">
        Canvas App
      </div>

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

      <div className="flex gap-3">
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
      </div>
    </div>
  );
};

export default Topbar;