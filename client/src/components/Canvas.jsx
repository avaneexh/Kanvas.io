import { useRef, useEffect, useState } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { drawElement } from "../utils/draw";
import { nanoid } from "nanoid";
import { getElementAtPosition } from "../utils/hitTest";
import { getHandles } from "../utils/resize";

export default function Canvas() {
  const canvasRef = useRef(null);

  // Zustand
  const elements = useCanvasStore((s) => s.elements);
  const tool = useCanvasStore((s) => s.tool);
  const color = useCanvasStore((s) => s.color);
  const zoom = useCanvasStore((s) => s.zoom);
  const pan = useCanvasStore((s) => s.pan);

  const setPan = useCanvasStore((s) => s.setPan);
  const setZoom = useCanvasStore((s) => s.setZoom);
  const addElement = useCanvasStore((s) => s.addElement);
  const updateElement = useCanvasStore((s) => s.updateElement);

  const selectedId = useCanvasStore((s) => s.selectedId);
  const setSelected = useCanvasStore((s) => s.setSelected);

  // Local state
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [textInput, setTextInput] = useState(null);

  const pathRef = useRef([]);

  // =========================
  // Helpers
  // =========================
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  // =========================
  // Redraw
  // =========================
  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);

    // Grid
    const gridSize = 50;
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1 / zoom;

    for (let x = -5000; x < 5000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -5000);
      ctx.lineTo(x, 5000);
      ctx.stroke();
    }

    for (let y = -5000; y < 5000; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-5000, y);
      ctx.lineTo(5000, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach((el) => drawElement(ctx, el, zoom));

    // Selection box
    if (selectedId) {
      const el = elements.find((e) => e.id === selectedId);
      if (!el) return;

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1 / zoom;
      ctx.strokeRect(el.x, el.y, el.width, el.height);

      const handles = getHandles(el);

      handles.forEach((h) => {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "blue";
        ctx.fillRect(h.x - 4, h.y - 4, 8, 8);
        ctx.strokeRect(h.x - 4, h.y - 4, 8, 8);
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redraw();
  }, [elements, zoom, pan, selectedId]);

  // =========================
  // Mouse Down
  // =========================
  const handleMouseDown = (e) => {
    const pos = getPos(e);

    // TEXT
    if (tool === "text") {
      setTextInput({ x: pos.x, y: pos.y, value: "" });
      return;
    }

    const el = getElementAtPosition(pos.x, pos.y, elements);

    // SELECTION
    if (tool === "selection") {
      if (el) {
        setSelected(el.id);

        const handles = getHandles(el);
        const handle = handles.find(
          (h) => Math.abs(h.x - pos.x) < 8 && Math.abs(h.y - pos.y) < 8
        );

        if (handle) {
          setResizing({ id: el.id, corner: handle.pos });
        } else {
          setDragging(true);
          setStart(pos);
        }
      } else {
        setSelected(null);
      }
      return;
    }

    // DRAW
    setIsDrawing(true);
    setStart(pos);

    if (tool === "freehand") {
      pathRef.current = [pos];
    }
  };

  // =========================
  // Mouse Move
  // =========================
  const handleMouseMove = (e) => {
    const pos = getPos(e);

    // DRAG
    if (dragging && selectedId) {
      const el = elements.find((e) => e.id === selectedId);

      const dx = pos.x - start.x;
      const dy = pos.y - start.y;

      updateElement(selectedId, {
        x: el.x + dx,
        y: el.y + dy
      });

      setStart(pos);
      return;
    }

    // RESIZE (ALL CORNERS)
    if (resizing) {
      const el = elements.find((e) => e.id === resizing.id);

      let newProps = {};

      switch (resizing.corner) {
        case "br":
          newProps = {
            width: pos.x - el.x,
            height: pos.y - el.y
          };
          break;

        case "tl":
          newProps = {
            x: pos.x,
            y: pos.y,
            width: el.x + el.width - pos.x,
            height: el.y + el.height - pos.y
          };
          break;

        case "tr":
          newProps = {
            y: pos.y,
            width: pos.x - el.x,
            height: el.y + el.height - pos.y
          };
          break;

        case "bl":
          newProps = {
            x: pos.x,
            width: el.x + el.width - pos.x,
            height: pos.y - el.y
          };
          break;
      }

      updateElement(resizing.id, newProps);
      return;
    }

    // FREEHAND
    if (isDrawing && tool === "freehand") {
      pathRef.current.push(pos);
    }
  };

  // =========================
  // Mouse Up
  // =========================
  const handleMouseUp = (e) => {
    const pos = getPos(e);

    setDragging(false);
    setResizing(null);

    if (!isDrawing || !start) return;

    setIsDrawing(false);

    const base = {
      id: nanoid(),
      x: start.x,
      y: start.y,
      strokeColor: color
    };

    let el = null;

    if (tool === "rectangle") {
      el = {
        ...base,
        type: "rectangle",
        width: pos.x - start.x,
        height: pos.y - start.y
      };
    }

    if (tool === "circle") {
      el = {
        ...base,
        type: "ellipse",
        width: pos.x - start.x,
        height: pos.y - start.y
      };
    }

    if (tool === "line") {
      el = {
        ...base,
        type: "line",
        x2: pos.x,
        y2: pos.y
      };
    }

    if (tool === "arrow") {
      el = {
        ...base,
        type: "arrow",
        x2: pos.x,
        y2: pos.y
      };
    }

    if (tool === "freehand") {
      el = {
        id: nanoid(),
        type: "freehand",
        points: pathRef.current,
        strokeColor: color
      };
    }

    if (el) addElement(el);
  };

  // =========================
  // Zoom
  // =========================
  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(Math.min(Math.max(zoom * factor, 0.2), 5));
  };

  // =========================
  // Pan (FIXED)
  // =========================
  const handlePan = (e) => {
    if (dragging || resizing || isDrawing) return;

    if (tool !== "selection" || e.buttons !== 1) return;

    setPan({
      x: pan.x + e.movementX,
      y: pan.y + e.movementY
    });
  };

  // =========================
  // JSX
  // =========================
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handlePan(e);
        }}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* TEXT INPUT */}
      {textInput && (
        <input
          autoFocus
          style={{
            position: "absolute",
            left: textInput.x * zoom + pan.x,
            top: textInput.y * zoom + pan.y
          }}
          value={textInput.value}
          onChange={(e) =>
            setTextInput({ ...textInput, value: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addElement({
                id: nanoid(),
                type: "text",
                x: textInput.x,
                y: textInput.y,
                text: textInput.value,
                strokeColor: color,
                fontSize: 20
              });
              setTextInput(null);
            }
          }}
        />
      )}
    </div>
  );
}