import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InterviewQuestion, Topic, Level } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questionText: {
      type: Type.STRING,
      description: "The generated interview question. Max 3 sentences.",
    },
    category: {
      type: Type.STRING,
      description: "The specific sub-topic (e.g., 'Remote Work', 'AI Ethics').",
    },
    grammarFocus: {
      type: Type.STRING,
      description: "The grammatical structure being tested (e.g., 'Second Conditional', 'Modals of Deduction').",
    },
    tip: {
      type: Type.STRING,
      description: "A short, helpful tip for answering this specific question.",
    },
    sampleStarter: {
      type: Type.STRING,
      description: "A sentence starter to help the learner begin their answer.",
    }
  },
  required: ["questionText", "category", "grammarFocus", "tip", "sampleStarter"],
};

// Define specific prompts for each category to ensure the style matches the user's request
const TOPIC_PROMPTS: Record<string, string> = {
  [Topic.WORK_CULTURE]: "Generate a question about: remote/hybrid work, management styles, office politics, work-life balance, salary vs benefits, or company culture.",
  [Topic.TECHNOLOGY]: "Generate a question about: AI, automation, smartphones, privacy, social media, space exploration, or the future of tech.",
  [Topic.EDUCATION]: "Generate a question about: university degrees, online learning, practical skills vs theory, language learning, or school curriculums.",
  [Topic.GROWTH]: "Generate a question about: defining success, handling failure, ambition, happiness vs money, risk-taking, or personal motivation.",
  [Topic.HYPOTHETICAL]: "Generate a 'Second Conditional' question starting with 'If...'. Examples: 'If you could change one law...', 'If you started a business...', 'If you lived on Mars...'.",
  [Topic.SITUATIONAL]: "Generate a 'What would you do if...' or 'Imagine that...' scenario. Focus on workplace conflicts, ethical dilemmas, or difficult decisions.",
  [Topic.RANDOM]: "Generate a random interesting question from any of the other categories."
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateQuestion = async (topic: Topic, level: Level): Promise<InterviewQuestion> => {
  const ai = getClient();
  const randomSeed = Math.floor(Math.random() * 1000000);
  
  // Get the specific instruction for the chosen topic
  const topicInstruction = TOPIC_PROMPTS[topic] || TOPIC_PROMPTS[Topic.RANDOM];

  const prompt = `
  Generate a NEW interview question.
  
  Topic: ${topic}
  Target Level: ${level}
  
  Specific Instruction for this Topic: ${topicInstruction}
  
  Random Seed: ${randomSeed}
  
  Constraint: Keep the question text SHORT. Maximum 2 or 3 sentences.
  `;

  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 1.2, // High temperature for creativity and variety
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No content generated");
      }

      return JSON.parse(text) as InterviewQuestion;
    } catch (error: any) {
      lastError = error;
      
      // Check for quota/rate limit errors
      const isQuotaError = 
        error?.status === 429 || 
        error?.code === 429 || 
        error?.message?.includes('429') || 
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('resource_exhausted');

      if (isQuotaError && attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(`Quota exceeded. Retrying in ${Math.round(waitTime)}ms...`);
        await delay(waitTime);
        continue;
      }
      
      // If it's not a quota error or we've run out of retries, throw
      throw error;
    }
  }

  throw lastError;
};