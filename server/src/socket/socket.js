import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;

      if (!cookies) return next(new Error("Unauthorized"));

      const token = cookies
        .split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-canvas", (canvasId) => {
      socket.join(canvasId);
    });

    socket.on("canvas-update", ({ canvasId, elements }) => {
      if (!Array.isArray(elements)) return;
      socket.to(canvasId).emit("canvas-update", elements);
    });

    socket.on("cursor-move", ({ canvasId, cursor }) => {
      socket.to(canvasId).emit("cursor-move", {
        userId: socket.userId,
        cursor
      });
    });

    socket.on("leave-canvas", (canvasId) => {
      socket.leave(canvasId);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};