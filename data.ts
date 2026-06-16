/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeekPlan {
  week: number;
  title: string;
  description: string;
  studentActivities: string;
  teacherGuidance: string;
  recommendedTools: string[];
}

export interface EvaluationRubric {
  criteria: string[];
  scoringGuide: string;
}

export interface PlanificationResult {
  proposalTitle: string;
  narrativeHook: string;
  pedagogicalValue: string;
  curriculumIntegration: string;
  sequence: WeekPlan[];
  evaluationRubric: EvaluationRubric;
  transmediaExpansion: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  tagline: string;
  avatarEmoji: string;
  color: string;
  archetype: string;
  roleDescription: string;
}

export interface TransmediaFormat {
  id: string;
  name: string;
  iconType: "podcast" | "escape" | "reels" | "comic" | "webdoc" | "ramified" | "videoessay";
  complexity: "Baja" | "Media" | "Alta" | "Muy Alta";
  duration: string;
  definition: string;
  pedagogicalPotential: string;
  recommendedTools: string[];
  skillsInvolved: string[];
  advantages: string;
  limitations: string;
  exampleProject: string;
  evaluationRubric: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTerms: string[];
}

export interface ToolItem {
  name: string;
  category: "audio" | "video" | "diseño" | "IA" | "edición" | "storytelling" | "colaboración" | "animación" | "videojuegos" | "mapas" | "podcast" | "gestión";
  description: string;
  utility: string;
  difficulty: "Fácil" | "Moderado" | "Avanzado";
  url: string;
}

export interface SavedProject {
  id: string;
  theme: string;
  subject: string;
  level: string;
  duration: string;
  primaryFormat: string;
  createdAt: string;
  plan: PlanificationResult;
}
