import { useCanvasStore } from "../store/canvasStore";
import {
  FaMousePointer,
  FaSquare,
  FaSlash,
  FaArrowRight,
  FaPen,
  FaRegCircle,
  FaFont,
} from "react-icons/fa";

export default function Toolbar() {
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);

  const tools = [
    { name: "selection", icon: <FaMousePointer /> },
    { name: "rectangle", icon: <FaSquare /> },
    { name: "line", icon: <FaSlash /> },
    { name: "arrow", icon: <FaArrowRight /> },
    { name: "freehand", icon: <FaPen /> },
    { name: "circle", icon: <FaRegCircle /> },
    { name: "text", icon: <FaFont /> },
  ];

  return (
    <div className="w-20 bg-white shadow flex flex-col items-center py-4 gap-4">
      {tools.map((t) => (
        <div key={t.name} className="relative group">
          <button
            onClick={() => setTool(t.name)}
            className={`p-2 rounded text-lg ${
              tool === t.name ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {t.icon}
          </button>

          {/* Tooltip */}
          <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {t.name}
          </span>
        </div>
      ))}
    </div>
  );
}