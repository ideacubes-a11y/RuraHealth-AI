import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateLogo() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: 'A clean, modern, minimalist app icon logo for a rural healthcare and agriculture app named "RuraHealth AI". The logo should feature a blend of a medical cross or health symbol with a plant leaf or crop, using emerald green and earthy tones. Solid white background, flat vector style, high quality, no text.',
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        fs.writeFileSync('public/logo.png', Buffer.from(base64Data, 'base64'));
        console.log('Logo generated and saved to public/logo.png');
        break;
      }
    }
  } catch (e) {
    console.error('Error generating logo:', e);
  }
}
generateLogo();
