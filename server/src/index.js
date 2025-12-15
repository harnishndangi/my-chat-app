import express from "express";
import authRoutes from "../src/routes/auth.routes.js"
import messageRoutes from "../src/routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
dotenv.config()

const port = process.env.PORT
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://nexuxchat.onrender.com", process.env.CORS_ORIGIN],
    credentials: true
}));


app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

server.listen(port,async()=>{
    await connectDB(); 
    console.log("Server is running on port 3000")
})
