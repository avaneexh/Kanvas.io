import { useRef, useEffect, useState } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { drawElement } from "../utils/draw";
import { nanoid } from "nanoid";
import { getElementAtPosition } from "../utils/hitTest";
import { getHandles } from "../utils/resize";

export default function Canvas() {
  const canvasRef = useRef(null);

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

  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [preview, setPreview] = useState(null);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);

   
    elements.forEach((el) => drawElement(ctx, el, zoom));

    
    if (preview) {
      drawElement(ctx, preview, zoom);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redraw();
  }, [elements, zoom, pan, preview]);


  const handleMouseDown = (e) => {
    const pos = getPos(e);
    const el = getElementAtPosition(pos.x, pos.y, elements);

    if (tool === "selection") {
      if (el) {
        setSelected(el.id);

        const handles = getHandles(el);
        const handle = handles.find(
          (h) =>
            Math.abs(h.x - pos.x) < 10 / zoom &&
            Math.abs(h.y - pos.y) < 10 / zoom
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

    setIsDrawing(true);
    setStart(pos);

   
    if (tool === "freehand") {
      const newEl = {
        id: nanoid(),
        type: "freehand",
        points: [pos],
        strokeColor: color,
      };

      addElement(newEl);
      setSelected(newEl.id);
    }
  };

  
  const handleMouseMove = (e) => {
    const pos = getPos(e);

    if (isDrawing && tool === "freehand" && selectedId) {
      const el = elements.find((e) => e.id === selectedId);
      if (!el) return;

      updateElement(el.id, {
        points: [...el.points, pos],
      });
      return;
    }


    if (dragging && selectedId) {
      const el = elements.find((e) => e.id === selectedId);
      if (!el) return;

      const dx = pos.x - start.x;
      const dy = pos.y - start.y;

      if (el.type === "line" || el.type === "arrow") {
        updateElement(el.id, {
          x: el.x + dx,
          y: el.y + dy,
          x2: el.x2 + dx,
          y2: el.y2 + dy,
        });
      } else {
        updateElement(el.id, {
          x: el.x + dx,
          y: el.y + dy,
        });
      }

      setStart(pos);
      return;
    }

    if (resizing) {
      const el = elements.find((e) => e.id === resizing.id);
      if (!el) return;

      if (el.type === "line" || el.type === "arrow") {
        if (resizing.corner === "start") {
          updateElement(el.id, { x: pos.x, y: pos.y });
        } else {
          updateElement(el.id, { x2: pos.x, y2: pos.y });
        }
        return;
      }

      const x1 = el.x;
      const y1 = el.y;
      const x2 = el.x + el.width;
      const y2 = el.y + el.height;

      let newProps = {};

      switch (resizing.corner) {
        case "tl":
          newProps = {
            x: pos.x,
            y: pos.y,
            width: x2 - pos.x,
            height: y2 - pos.y,
          };
          break;
        case "tr":
          newProps = {
            y: pos.y,
            width: pos.x - x1,
            height: y2 - pos.y,
          };
          break;
        case "bl":
          newProps = {
            x: pos.x,
            width: x2 - pos.x,
            height: pos.y - y1,
          };
          break;
        case "br":
          newProps = {
            width: pos.x - x1,
            height: pos.y - y1,
          };
          break;
      }

      updateElement(el.id, newProps);
      return;
    }
  };


  const handleMouseUp = (e) => {
    const pos = getPos(e);

    setDragging(false);
    setResizing(null);

    if (!isDrawing || !start) return;

    if (tool === "freehand") {
      setIsDrawing(false);
      setPreview(null); 
      return;
    }

    const x = Math.min(start.x, pos.x);
    const y = Math.min(start.y, pos.y);
    const width = Math.abs(pos.x - start.x);
    const height = Math.abs(pos.y - start.y);

    let el = null;

    if (tool === "rectangle") {
      el = {
        id: nanoid(),
        type: "rectangle",
        x,
        y,
        width,
        height,
        strokeColor: color,
      };
    }

    if (tool === "circle") {
      el = {
        id: nanoid(),
        type: "ellipse",
        x,
        y,
        width,
        height,
        strokeColor: color,
      };
    }

    if (tool === "line" || tool === "arrow") {
      el = {
        id: nanoid(),
        type: tool,
        x: start.x,
        y: start.y,
        x2: pos.x,
        y2: pos.y,
        strokeColor: color,
      };
    }

    if (el) {
      addElement(el);
    }

    setPreview(null);


    setIsDrawing(false);
  };


  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(Math.min(Math.max(zoom * factor, 0.2), 5));
  };

  const handlePan = (e) => {
    if (dragging || resizing || isDrawing) return;
    if (tool !== "selection" || e.buttons !== 1) return;

    setPan({
      x: pan.x + e.movementX,
      y: pan.y + e.movementY,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-white"
        style={{
          cursor:
            tool === "freehand"
              ? "crosshair"
              : tool === "selection"
              ? "default"
              : "crosshair",
        }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handlePan(e);
      }}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}