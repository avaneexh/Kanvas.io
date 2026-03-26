export const getHandles = (el) => {
  const padding = 8;

  if (el.type === "line" || el.type === "arrow") {
    return [
      { x: el.x, y: el.y, pos: "start" },
      { x: el.x2, y: el.y2, pos: "end" }
    ];
  }

  const x1 = Math.min(el.x, el.x + el.width);
  const y1 = Math.min(el.y, el.y + el.height);
  const x2 = Math.max(el.x, el.x + el.width);
  const y2 = Math.max(el.y, el.y + el.height);

  return [
    { x: x1 - padding, y: y1 - padding, pos: "tl" },
    { x: x2 + padding, y: y1 - padding, pos: "tr" },
    { x: x1 - padding, y: y2 + padding, pos: "bl" },
    { x: x2 + padding, y: y2 + padding, pos: "br" }
  ];
};