export const getElementAtPosition = (x, y, elements) => {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];

    // ================= LINE =================
    if (el.type === "line" || el.type === "arrow") {
      const x1 = el.x;
      const y1 = el.y;
      const x2 = el.x2;
      const y2 = el.y2;

      const A = x - x1;
      const B = y - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;

      let t = dot / lenSq;
      t = Math.max(0, Math.min(1, t));

      const projX = x1 + t * C;
      const projY = y1 + t * D;

      const dist = Math.hypot(x - projX, y - projY);

      if (dist < 12) return el;
    }

    // ================= ELLIPSE =================
    if (el.type === "ellipse") {
      const rx = el.width / 2;
      const ry = el.height / 2;

      const cx = el.x + rx;
      const cy = el.y + ry;

      if (rx === 0 || ry === 0) return false;

      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;

      return dx * dx + dy * dy <= 1;
    }

    // ================= RECT =================
    if (el.type === "rectangle") {
      const x1 = Math.min(el.x, el.x + el.width);
      const y1 = Math.min(el.y, el.y + el.height);
      const x2 = Math.max(el.x, el.x + el.width);
      const y2 = Math.max(el.y, el.y + el.height);

      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        return el;
      }
    }

    // ================= TEXT =================
    if (el.type === "text") {
      if (x >= el.x && x <= el.x + 100 && y >= el.y - 20 && y <= el.y + 20) {
        return el;
      }
    }
  }

  return null;
};
