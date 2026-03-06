import * as diseaseEngine from "../utils/diseaseEngine.js";

export async function handleSymptomAnalysis(req, res) {
  const { symptoms, type, language } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required" });
  }

  try {
    const result = await diseaseEngine.analyzeSymptoms(symptoms, type, language);
    res.json(result);
  } catch (error) {
    console.error("Error in symptomController:", error);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
}
