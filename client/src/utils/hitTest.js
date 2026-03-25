export const getElementAtPosition = (x, y, elements) => {
  return elements.findLast((el) => {
    if (el.type === "rectangle") {
      return (
        x >= el.x &&
        x <= el.x + el.width &&
        y >= el.y &&
        y <= el.y + el.height
      );
    }

    if (el.type === "line" || el.type === "arrow") {
      const dist =
        Math.abs(
          (el.y2 - el.y) * x -
            (el.x2 - el.x) * y +
            el.x2 * el.y -
            el.y2 * el.x
        ) /
        Math.hypot(el.y2 - el.y, el.x2 - el.x);

      return dist < 5;
    }

    if (el.type === "ellipse") {
        return (
            x >= el.x &&
            x <= el.x + el.width &&
            y >= el.y &&
            y <= el.y + el.height
        );
    }

    if (el.type === "text") {
        return (
            x >= el.x &&
            x <= el.x + 100 &&
            y >= el.y - 20 &&
            y <= el.y + 20
        );
    }

    return false;
  });
};