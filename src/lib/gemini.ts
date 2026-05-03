import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function extractSkills(resumeText: string): Promise<string[]> {
  const prompt = `
    Extract a list of professional skills from the following resume text. 
    Return ONLY a JSON array of strings.
    Resume Text: ${resumeText}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Basic JSON extraction from markdown
    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (e) {
    console.error("Failed to parse skills JSON:", e);
    return [];
  }
}

export async function generateLearningTree(skills: string[], dreamGoal: string) {
  const prompt = `
    You are an expert curriculum architect. Based on the user's current skills and their "Dream Goal", generate a hierarchical learning tree (roadmap).
    
    Current Skills: ${skills.join(", ")}
    Dream Goal: ${dreamGoal}
    
    Return a JSON object with:
    1. "nodes": Array of objects { id: string, label: string, description: string, level: number }
    2. "edges": Array of objects { id: string, source: string, target: string }
    
    Guidelines:
    - Nodes should represent specific skills or milestones needed to reach the goal.
    - Start with nodes the user partially knows or needs to master first.
    - Organize levels from 1 (foundation) to N (mastery).
    - Ensure a logical dependency flow via edges.
    
    Return ONLY valid JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{.*\}/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { nodes: [], edges: [] };
  } catch (e) {
    console.error("Failed to parse tree JSON:", e);
    return { nodes: [], edges: [] };
  }
}

export async function generateQuiz(skillName: string, description: string) {
  const prompt = `
    Generate 3 challenging multiple-choice questions to test mastery of the skill: "${skillName}".
    Skill Description: ${description}
    
    Return ONLY a JSON array of objects:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0, // index of correct option
        "explanation": "string"
      }
    ]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (e) {
    console.error("Failed to parse quiz JSON:", e);
    return [];
  }
}

export async function scoreQuiz(skillName: string, questions: any[], userAnswers: number[]) {
  const prompt = `
    Evaluate the following quiz results for the skill "${skillName}".
    
    Questions and User Answers:
    ${JSON.stringify(questions.map((q, i) => ({ 
      question: q.question, 
      correct: q.options[q.correctAnswer], 
      userAnswer: q.options[userAnswers[i]] 
    })), null, 2)}
    
    Decide if the user has passed (at least 2/3 correct).
    Return ONLY a JSON object: { "passed": boolean, "score": number, "feedback": "string" }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{.*\}/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { passed: false, score: 0, feedback: "Error scoring" };
  } catch (e) {
    console.error("Failed to parse score JSON:", e);
    return { passed: false, score: 0, feedback: "Error scoring" };
  }
}
