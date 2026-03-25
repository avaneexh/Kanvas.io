import { useCanvasStore } from "../store/canvasStore";

export default function Toolbar() {
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);

  const tools = ["selection", "rectangle", "line", "arrow", "freehand", "circle", "text"];

  return (
    <div className="w-20 bg-white shadow flex flex-col items-center py-4 gap-4">
      {tools.map((t) => (
        <button
          key={t}
          onClick={() => setTool(t)}
          className={`px-2 py-1 text-xs rounded ${
            tool === t ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}