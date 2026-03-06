import * as diseaseEngine from "../utils/diseaseEngine.js";

export async function handleImageAnalysis(req, res) {
  const { type, language } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    const result = await diseaseEngine.analyzeImage(file.buffer, file.mimetype, type, language);
    res.json(result);
  } catch (error) {
    console.error("Error in imageController:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
