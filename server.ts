import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

import authRoutes from './routes/auth.ts';
import leadsRoutes from './routes/leads.ts';
import activitiesRoutes from './routes/activities.ts';
import seedRoutes from './routes/seed.ts';
import notificationsRoutes from './routes/notifications.ts';

// ...

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/seed", seedRoutes);

// Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
