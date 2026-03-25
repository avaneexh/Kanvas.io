import { useCanvasStore } from "../store/canvasStore";

const Topbar = () => {
  const tool = useCanvasStore((s) => s.tool);
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);

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

      <div className="flex gap-4">
        <button className="px-3 py-1 bg-gray-200 rounded">
          Undo
        </button>
        <button className="px-3 py-1 bg-gray-200 rounded">
          Redo
        </button>
      </div>
    </div>
  );
};

export default Topbar;