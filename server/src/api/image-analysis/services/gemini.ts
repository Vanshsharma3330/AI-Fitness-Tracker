import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required for image analysis.");
}

const ai = new GoogleGenAI({ apiKey });
const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

export const analyzeImage = async (filePath: string) => {
    try {
        const base64ImageFile = fs.readFileSync(filePath, {
            encoding: "base64",
        });

        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64ImageFile,
                },
            },
            {
                text: "Extract the food name and estimated calories from this image in a JSON object.",
            },
        ];

        const config = {
            responseMimeType: "application/json",
            responseJsonSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    calories: { type: "number" },
                },
                required: ["name", "calories"],
            },
        };

        const response = await ai.models.generateContent({
            model,
            contents,
            config,
        });

        const responseText =
  (response as any).text ||
  (response as any).candidates?.[0]?.content?.parts?.[0]?.text ||
  "{}";
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini analysis error:", error);
        throw error;
    }
};
