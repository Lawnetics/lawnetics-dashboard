import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import { seedDatabase } from "./config/seeder.js";
import cors from "cors";
import path from "path";
import fs from "fs";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import matterRoutes from "./routes/matterRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists for local storage fallback
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Connect Database & Seed
await connectDB();
await seedDatabase();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/matters", matterRoutes);
app.use("/api/deadlines", deadlineRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
    res.send("API is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});