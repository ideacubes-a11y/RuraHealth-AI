import express from "express";
import multer from "multer";
import { handleImageAnalysis } from "../controllers/imageController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), handleImageAnalysis);

export default router;
