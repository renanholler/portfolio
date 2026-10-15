import type { PortfolioContent } from "./portfolio";

export const portfolioEn: PortfolioContent = {
  projects: [
    {
      id: "unnichat",
      name: "Unnichat Dashboard",
      description:
        "Full redesign of the main dashboard for Unnichat, a messaging platform with 1,600+ monthly active users. Improved metrics visualization, performance optimization, and responsive design across devices.",
      highlights: ["1,600+ MAU", "Full-stack redesign", "Query optimization", "Responsive"],
      stack: ["TypeScript", "PostgreSQL", "React", "TailwindCSS", "Firebase"],
      image: "/unnichat.png",
    },
    {
      id: "almoxarifado",
      name: "Inventory Dashboard",
      description:
        "Full-stack inventory management dashboard built for a small business. Features item management, stock in/out tracking, low-stock and expiration alerts, history, and CSV/PDF exports.",
      highlights: [
        "Authenticated SPA",
        "Shared validation",
        "Edge JWT auth",
        "Single repo deployment",
      ],
      stack: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "Supabase",
        "Zod",
        "React Hook Form",
        "TanStack Table",
        "shadcn/ui",
        "Tailwind",
      ],
      image: "/inventory.png",
    },
    {
      id: "fincheck",
      name: "Fincheck",
      description:
        "Personal finance management app to track accounts, expenses, income, and investments. Built with a modern full-stack TypeScript architecture.",
      highlights: ["Multi-account tracking", "Expense categorization", "Investment monitoring"],
      stack: ["TypeScript", "React", "TailwindCSS", "Prisma", "PostgreSQL"],
    },
    {
      id: "waiterapp",
      name: "WaiterApp",
      description:
        "Restaurant order management system with a mobile interface for waiters, a web dashboard for the kitchen, and a REST API connecting both.",
      highlights: ["Multi-surface architecture", "Real-time order flow", "Mobile + Web + API"],
      stack: ["React Native", "React", "Node.js", "TypeScript"],
    },
    {
      id: "umode",
      name: "uMode Platform",
      description:
        "Full-stack CRUD modules and data grid modernization for a fashion/product management platform. Optimized SQL export queries processing ~47k rows, reducing execution time by ~80%.",
      highlights: ["80% query optimization", "Advanced data grids", "Legacy modernization"],
      stack: ["NestJS", "TypeScript", "React", "MongoDB", "MySQL", "AWS"],
    },
  ],
  experience: [
    {
      company: "uMode",
      role: "Software Engineer",
      period: "Apr 2026 – Present",
      stack: "NestJS, TypeScript, React, MongoDB, MySQL, AWS",
      bullets: [
        "Optimized SQL export queries (~47k rows), reducing execution time by ~80%",
        "Designed full-stack CRUD modules for materials, suppliers, colors, measurements, collections",
        "Leading platform modernization: legacy tables → advanced data grids with filtering, sorting, record management",
      ],
    },
    {
      company: "Unnichat",
      role: "Software Engineer",
      period: "Apr 2025 – Feb 2026",
      stack: "Node.js, TypeScript, React, TailwindCSS, PostgreSQL, Firebase, Docker",
      bullets: [
        "Redesigned main dashboard used by 1,600+ monthly active users",
        "Built analytics processing thousands of messaging events with real-time insights",
        "Implemented granular permissions system for scalability and security",
      ],
    },
    {
      company: "Governança Brasil",
      role: "Software Engineer",
      period: "Feb 2023 – Jun 2024",
      stack: "Visual Basic, .NET, MySQL, Azure DevOps",
      bullets: [
        "Systems adopted by 600+ municipalities and 45,000+ users",
        "Developed procurement and asset modules integrated with 20+ systems",
      ],
    },
    {
      company: "IPM Sistemas",
      role: "Software Engineer",
      period: "Mar 2019 – Feb 2023",
      stack: "PHP, PostgreSQL, SVN, jQuery",
      bullets: [
        "Public systems adopted by 850+ municipalities, serving 30M citizens, 200M+ annual interactions",
        "Delivered procurement solutions enabling over R$8 billion in municipal savings",
        "Mentored junior developers and supported architectural decisions",
      ],
    },
  ],
  skills: [
    { title: "Frontend", items: ["React", "Next.js", "TypeScript", "TailwindCSS", "React Native"] },
    { title: "Backend", items: ["Node.js", "NestJS", "Python", "PHP", ".NET"] },
    { title: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma"] },
    { title: "Cloud & DevOps", items: ["AWS", "Docker", "Firebase", "Azure DevOps"] },
    { title: "AI/ML", items: ["LangChain", "pgVector", "RAG"] },
  ],
  scheduling: {
    intro:
      "Pick a time to chat. You'll get a confirmation email with the video call link.",
    eventTitle: "Chat with Renan",
    eventTitleTemplate: "Call with {name}",
    durationLabel: "30 minutes",
    location: "Video call — link sent by email.",
    timezoneLabel: "São Paulo (GMT-3)",
    workBlockTitle: "Busy",
  },
};
