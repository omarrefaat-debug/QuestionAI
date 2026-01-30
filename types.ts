export enum Topic {
  RANDOM = 'Random',
  WORK_CULTURE = 'Workplace & Culture',
  TECHNOLOGY = 'Technology & Future',
  EDUCATION = 'Education & Society',
  GROWTH = 'Personal Growth',
  HYPOTHETICAL = 'Hypothetical',
  SITUATIONAL = 'Situational'
}

export enum Level {
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1'
}

export interface InterviewQuestion {
  questionText: string;
  category: string;
  grammarFocus: string;
  tip: string;
  sampleStarter: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}