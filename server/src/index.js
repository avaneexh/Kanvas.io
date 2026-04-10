import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./socket/socket.js";
import http from "http";
import authRoutes from "./routes/auth.routes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello From Kanvas.io");
});

app.use("/api/v1/auth", authRoutes);

const server = http.createServer(app);

initSocket(server);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
