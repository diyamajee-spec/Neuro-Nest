import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse skills JSON. Raw text:", text);
    return [];
  }
}

export async function generateLearningTree(skills: string[], dreamGoal: string) {
  const prompt = `
    You are an expert curriculum architect. Based on the user's current skills and their "Dream Goal", generate a hierarchical learning tree (roadmap).
    
    Current Skills: ${skills.join(", ")}
    Dream Goal: ${dreamGoal}
    
    Return a JSON object with:
    1. "nodes": Array of objects { 
        id: string, 
        label: string, 
        description: string, 
        level: number,
        category: "frontend" | "backend" | "ai" | "infrastructure" | "soft",
        resources: Array<{ title: string, type: "video" | "doc" | "project", url_placeholder: string }>,
        market_insight: { salary_range: string, demand_level: "high" | "medium" | "low" }
       }
    2. "edges": Array of objects { id: string, source: string, target: string }
    3. "roadmap_summary": string (a high-level overview of the journey)
    
    Guidelines:
    - Nodes should represent specific skills or milestones needed to reach the goal.
    - Start with nodes the user partially knows or needs to master first.
    - Organize levels from 1 (foundation) to N (mastery).
    - Ensure a logical dependency flow via edges.
    - Resources should be highly relevant (e.g. "Official Next.js Documentation" or "Building a RAG with LangChain project").
    
    Return ONLY valid JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { nodes: [], edges: [] };
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse tree JSON. Raw text:", text);
    return { nodes: [], edges: [] };
  }
}

export async function generateQuiz(skillName: string, description: string, difficulty: 'beginner' | 'intermediate' | 'expert' = 'intermediate') {
  const prompt = `
    Generate 5 highly challenging multiple-choice questions to test mastery of the skill: "${skillName}".
    Skill Description: ${description}
    Target Difficulty: ${difficulty}
    
    Return ONLY a JSON array of objects:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0, // index of correct option
        "explanation": "string",
        "difficulty": "${difficulty}"
      }
    ]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse quiz JSON. Raw text:", text);
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
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { passed: false, score: 0, feedback: "Error scoring" };
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      passed: parsed.passed ?? false,
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      feedback: parsed.feedback || "Scoring evaluation complete."
    };
  } catch (e) {
    console.error("Failed to parse score JSON. Raw text:", text);
    return { passed: false, score: 0, feedback: "Error scoring" };
  }
}
