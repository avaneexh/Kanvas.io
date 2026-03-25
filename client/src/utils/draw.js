import rough from "roughjs/bundled/rough.esm";

export const drawElement = (ctx, el, zoom) => {
  const rc = rough.canvas(ctx.canvas);

  switch (el.type) {
    case "rectangle":
      rc.rectangle(el.x, el.y, el.width, el.height, {
        stroke: el.strokeColor
      });
      break;

    case "line":
      rc.line(el.x, el.y, el.x2, el.y2, {
        stroke: el.strokeColor
      });
      break;

    case "arrow":
      drawArrow(ctx, el, zoom);
      break;

    case "freehand":
      ctx.beginPath();
      el.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = el.strokeColor;
      ctx.stroke();
      break;
    
    case "ellipse":
      rc.ellipse(el.x, el.y, el.width, el.height, {
        stroke: el.strokeColor
      });
      break;
   
    case "text":
      ctx.fillStyle = el.strokeColor;
      ctx.font = `${el.fontSize / zoom}px Arial`;
      ctx.fillText(el.text, el.x, el.y);
      break;
  }
};

const drawArrow = (ctx, el, zoom) => {
  const headlen = 10 / zoom;
  const angle = Math.atan2(el.y2 - el.y, el.x2 - el.x);

  ctx.strokeStyle = el.strokeColor;
  ctx.fillStyle = el.strokeColor;
  ctx.lineWidth = 2 / zoom;

  ctx.beginPath();
  ctx.moveTo(el.x, el.y);
  ctx.lineTo(el.x2, el.y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(el.x2, el.y2);
  ctx.lineTo(
    el.x2 - headlen * Math.cos(angle - Math.PI / 6),
    el.y2 - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    el.x2 - headlen * Math.cos(angle + Math.PI / 6),
    el.y2 - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
};