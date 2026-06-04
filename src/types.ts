export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Problem {
  id: string;
  topicId: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  pattern: string;
  explanation: string;
  solutionApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
  leetcodeUrl: string;
  gfgUrl: string;
  hackerRankUrl?: string;
  codeforcesUrl?: string;
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studyTime: string;
  prerequisites: string[];
  overview: string;
  theory: {
    coreConcepts: string[];
    visualExplanation: string;
    timeComplexity: { [key: string]: string };
    spaceComplexity: { [key: string]: string };
  };
  cheatSheet: {
    title: string;
    points: string[];
  };
  patterns: {
    name: string;
    description: string;
    templates: {
      java: string;
      kotlin: string;
      python: string;
      cpp: string;
    };
  }[];
}

export interface RoadmapNode {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedStudyTime: string;
  prerequisites: string[];
  x: number; // For interactive visual roadmap plotting
  y: number;
}

export interface UserProgress {
  completedTopics: string[]; // Topic IDs
  solvedProblems: string[]; // Problem IDs
  revisionStreak: number;
  lastActiveDate: string; // ISO string
  weakAreas: string[]; // Topic IDs flagged as weak
  revisionStatus: { [topicId: string]: 'unrevised' | 'revised' | 'mastered' };
  solvedProblemDates?: { [problemId: string]: string }; // problemId -> completion ISO Date string
  leetcodeUsername?: string;
  leetcodeSolvedProblems?: { [titleSlug: string]: string }; // titleSlug -> completion ISO string or timestamp
  maxAgeDays?: number; // Previous days limit to consider done (e.g. 90, 180, etc.), undefined/all-time if unset
}

export interface SDEPlanDay {
  day: number;
  title: string;
  topicId: string;
  tasks: string[];
}

export interface SDEPlan {
  id: string;
  name: string;
  durationDays: number;
  description: string;
  schedule: SDEPlanDay[];
}
