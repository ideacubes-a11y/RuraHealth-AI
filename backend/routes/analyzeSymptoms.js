import express from "express";
import { handleSymptomAnalysis } from "../controllers/symptomController.js";

const router = express.Router();

router.post("/", handleSymptomAnalysis);

export default router;
