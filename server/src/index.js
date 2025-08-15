import express from "express";
import authRoutes from "../src/routes/auth.routes.js"
import messageRoutes from "../src/routes/message.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import { app,server } from "./lib/socket.js";
 
dotenv.config()

const port = process.env.PORT
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

server.listen(port,async()=>{
    await connectDB(); 
    console.log("Server is running on port 3000")
})
