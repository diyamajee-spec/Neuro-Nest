import { GoogleGenerativeAI } from "@google/generative-ai";

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Gemini Response:", response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

testGemini();
