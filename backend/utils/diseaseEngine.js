import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSymptoms(symptoms, type, language = 'English') {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following ${type || 'health'} symptoms for a rural community in India: "${symptoms}". 
    The user is speaking/writing in ${language}.
    Provide a response in JSON format with the following fields:
    - disease: Possible disease name (Translate to ${language})
    - probability: Estimated probability (e.g., "72%")
    - riskLevel: One of "Safe", "Monitor", or "Urgent"
    - advice: Simple first aid or immediate steps (Translate to ${language})
    - warning: A clear warning if a doctor/vet/expert consultation is needed (Translate to ${language}).
    Keep the language very simple for semi-literate users.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { type: Type.STRING },
          probability: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          advice: { type: Type.STRING },
          warning: { type: Type.STRING },
        },
        required: ["disease", "probability", "riskLevel", "advice", "warning"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function analyzeImage(buffer, mimetype, type, language = 'English') {
  const base64Data = buffer.toString("base64");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimetype,
          },
        },
        {
          text: `Analyze this image for ${type || 'health'} issues in a rural Indian context. 
          Identify any visible disease or condition.
          The user prefers responses in ${language}.
          Provide a response in JSON format with:
          - disease: Possible disease or condition name (Translate to ${language})
          - probability: Estimated probability (e.g., "72%")
          - riskLevel: One of "Safe", "Monitor", or "Urgent"
          - advice: Simple immediate steps (Translate to ${language})
          - warning: Warning if expert help is needed (Translate to ${language}).
          Use very simple language.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { type: Type.STRING },
          probability: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          advice: { type: Type.STRING },
          warning: { type: Type.STRING },
        },
        required: ["disease", "probability", "riskLevel", "advice", "warning"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}
