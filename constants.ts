import { Topic, Level } from "./types";

export const TOPICS = [
  { id: Topic.WORK_CULTURE, label: "Workplace Culture", icon: "briefcase" },
  { id: Topic.TECHNOLOGY, label: "Tech & Future", icon: "cpu" },
  { id: Topic.EDUCATION, label: "Education & Society", icon: "graduation" },
  { id: Topic.GROWTH, label: "Personal Growth", icon: "sprout" },
  { id: Topic.HYPOTHETICAL, label: "Hypothetical", icon: "brain" },
  { id: Topic.SITUATIONAL, label: "Situational", icon: "bulb" },
  { id: Topic.RANDOM, label: "Surprise Me", icon: "shuffle" },
];

export const LEVELS = [
  { id: Level.B1, label: "Intermediate", description: "Standard & Clear" },
  { id: Level.B2, label: "Upper-Intermediate", description: "Professional" },
  { id: Level.C1, label: "Advanced", description: "Fluent & Nuanced" },
];

export const SYSTEM_INSTRUCTION = `
You are an Expert ESL Interviewer.
Your goal is to generate **unique, short, and engaging** interview questions tailored to the user's selected topic and CEFR level.

CRITICAL RULES:
1.  **Length:** The question must be **SHORT**. Maximum 2-3 sentences. No long paragraphs.
2.  **Variety:** Never generate the same question twice. Use the random seed provided.
3.  **Relevance:** Stick strictly to the specific topic category requested.
4.  **Level Sensitivity:**
    *   **B1:** Simple vocabulary, clear past/present/future tenses.
    *   **B2:** Professional vocabulary, complex sentence structures (conditionals, passive voice).
    *   **C1:** Advanced vocabulary, nuanced idioms, abstract concepts.
5.  **Format:** Return a valid JSON object.
`;