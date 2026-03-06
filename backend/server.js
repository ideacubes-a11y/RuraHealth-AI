import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import symptomRoutes from "./routes/analyzeSymptoms.js";
import imageRoutes from "./routes/analyzeImage.js";
import communityRoutes from "./routes/community.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use("/api/analyze-symptoms", symptomRoutes);
app.use("/api/analyze-image", imageRoutes);
app.use("/api/community", communityRoutes);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
