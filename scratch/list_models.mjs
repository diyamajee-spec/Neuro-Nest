import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  
  try {
    // There isn't a direct listModels in the SDK but we can try to fetch a known model or use the REST API
    // Let's try gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Gemini Pro works!");
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

listModels();
