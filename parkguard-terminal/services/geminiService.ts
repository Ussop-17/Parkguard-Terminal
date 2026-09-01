
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeFrames = async (base64Images: string[], retryCount = 0): Promise<DetectionResult> => {
  if (!base64Images || base64Images.length === 0) {
    console.error("Gemini Analysis Error: No frames provided.");
    return { vehiclePresent: false, plateDetected: null, confidence: 0 };
  }

  try {
    const HARDCODED_KEY = "AIzaSyAm6u-AlnlKPz3PF2GMEGfdaNtVArCbhY";
    let apiKey = HARDCODED_KEY;
    
    // Only use the environment variable if it looks like a real, valid API key (long enough)
    const envKey = process.env.GEMINI_API_KEY;
    if (envKey && envKey.length > 20 && envKey !== "undefined") {
      apiKey = envKey;
    }
    
    // Final check for sanity - clean the key
    apiKey = apiKey.trim().replace(/['"]+/g, '');

    if (!apiKey || apiKey.length < 30) {
      console.warn("Detected invalid API key length:", apiKey?.length);
      throw new Error("API_KEY_MISSING");
    }

    console.info(`[ParkGuard AI] Initializing with key: ${apiKey.substring(0, 6)}... (Length: ${apiKey.length})`);

    const ai = new GoogleGenAI({ apiKey });
    
    // Convert multiple frames into image parts
    const imageParts = base64Images.map(b64 => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: b64,
      }
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          ...imageParts,
          {
            text: `You are looking at multiple frames captured from a single CCTV video of a parking event.
            Analyze all frames to identify the vehicle and its license plate.
            
            Tasks:
            1. Consolidate identifying info from all frames.
            2. Extract the EXACT license plate alphanumeric characters (e.g. TN23DM1848). Ignore shadows or blurs.
            3. vehiclePresent: true if a vehicle is in any frame.
            4. plateDetected: The confirmed alphanumeric string (NO spaces), or null if unreadable in ALL frames.
            5. makeModel: Brand and model (e.g. Hyundai Creta).
            6. color: Car color.
            
            Return ONLY a valid JSON object with: 
            vehiclePresent (boolean), plateDetected (string/null), vehicleType (string), makeModel (string), color (string), confidence (0.0-1.0).`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vehiclePresent: { type: Type.BOOLEAN },
            plateDetected: { type: Type.STRING, nullable: true },
            vehicleType: { type: Type.STRING },
            makeModel: { type: Type.STRING },
            color: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ["vehiclePresent", "plateDetected", "confidence", "vehicleType", "color", "makeModel"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text);
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    
    if (errorMsg.includes('API_KEY_MISSING') || errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not found')) {
      return { vehiclePresent: false, plateDetected: "CONFIG_ERROR", confidence: 0 };
    }
    
    console.error(`Gemini Analysis Error (Attempt ${retryCount + 1}):`, error);

    if (errorMsg.includes('429') && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount) * 2000;
      await delay(waitTime);
      return analyzeFrames(base64Images, retryCount + 1);
    }

    // Return the actual error message to the dashboard so we can see what's wrong
    return { vehiclePresent: false, plateDetected: `ERR: ${errorMsg.substring(0, 30)}`, confidence: 0 };
  }
};
