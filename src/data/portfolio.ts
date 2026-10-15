export type Project = {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  stack: string[];
  image?: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  stack: string;
  bullets: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type SchedulingContent = {
  intro: string;
  eventTitle: string;
  eventTitleTemplate: string;
  durationLabel: string;
  location: string;
  timezoneLabel: string;
  workBlockTitle: string;
};

export type PortfolioContent = {
  projects: Project[];
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  scheduling: SchedulingContent;
};

export const social = {
  email: "renan@hollercode.dev",
  github: "https://github.com/renanholler",
  linkedin: "https://www.linkedin.com/in/renan-holler",
  resume: "#",
};

export const schedulingConfig = {
  durationMinutes: 30,
  timezone: "America/Sao_Paulo",
  availableWeekdays: [1, 2, 3, 4, 5],
  weeksAhead: 4,
  timeSlots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
  leadTimeDays: 1,
};
