export const getHandles = (el) => {
  return [
    { x: el.x, y: el.y, pos: "tl" },
    { x: el.x + el.width, y: el.y, pos: "tr" },
    { x: el.x, y: el.y + el.height, pos: "bl" },
    { x: el.x + el.width, y: el.y + el.height, pos: "br" }
  ];
};