import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./src/prisma.js";
import router from "./src/routes.js";
import { ensureBucketExists } from "./src/services/storage.service.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", service: "backend" });
  } catch (error) {
    res.status(500).json({ status: "error", service: "backend", detail: error.message });
  }
});

const startServer = async () => {
  await ensureBucketExists();
  app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
