import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on a text prompt.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Edits an existing image based on a text prompt.
 * Uses the image as inlineData.
 */
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Remove data URL prefix if present for the API call (though inlineData usually handles raw base64, 
    // it's safer to strip the header for the API if we were treating it as raw bytes, 
    // but the SDK inlineData usually expects the raw base64 string without the `data:image/png;base64,` prefix)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    
    // We assume PNG for now, or we could detect it.
    // The model is robust with standard mime types.
    const mimeType = base64Image.match(/[^:]\w+\/[\w-+\d.]+(?=[;,])/)?.[0] || 'image/png';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Helper to extract the first image found in the response parts.
 */
const extractImageFromResponse = (response: GenerateContentResponse): string => {
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates returned from Gemini.");
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    throw new Error("No content parts returned.");
  }

  // Iterate through parts to find the image
  for (const part of parts) {
    if (part.inlineData && part.inlineData.data) {
      // Return as a usable Data URI
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${part.inlineData.data}`;
    }
  }

  // If we got text but no image (e.g. refusal or error description in text)
  const textPart = parts.find(p => p.text);
  if (textPart) {
    throw new Error(`Model returned text instead of image: ${textPart.text}`);
  }

  throw new Error("No image data found in response.");
};