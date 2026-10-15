import type { PortfolioContent } from "./portfolio";

export const portfolioPt: PortfolioContent = {
  projects: [
    {
      id: "unnichat",
      name: "Unnichat Dashboard",
      description:
        "Redesign completo do dashboard principal do Unnichat, plataforma de mensagens com mais de 1.600 usuários ativos mensais. Melhorei a visualização de métricas, otimizei performance e adaptei o layout para diferentes dispositivos.",
      highlights: ["1.600+ MAU", "Redesign full-stack", "Otimização de queries", "Responsivo"],
      stack: ["TypeScript", "PostgreSQL", "React", "TailwindCSS", "Firebase"],
      image: "/unnichat.png",
    },
    {
      id: "almoxarifado",
      name: "Dashboard de Estoque",
      description:
        "Dashboard full-stack de gestão de estoque para um pequeno negócio. Inclui cadastro de itens, controle de entradas e saídas, alertas de estoque baixo e validade, histórico e exportação em CSV/PDF.",
      highlights: [
        "SPA autenticada",
        "Validação compartilhada",
        "Auth JWT na edge",
        "Deploy em repositório único",
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
        "Aplicativo de finanças pessoais para acompanhar contas, despesas, receitas e investimentos. Construído com arquitetura full-stack moderna em TypeScript.",
      highlights: ["Multi-contas", "Categorização de despesas", "Monitoramento de investimentos"],
      stack: ["TypeScript", "React", "TailwindCSS", "Prisma", "PostgreSQL"],
    },
    {
      id: "waiterapp",
      name: "WaiterApp",
      description:
        "Sistema de gestão de pedidos para restaurantes com interface mobile para garçons, dashboard web para cozinha e API REST conectando os dois.",
      highlights: [
        "Arquitetura multi-superfície",
        "Fluxo de pedidos em tempo real",
        "Mobile + Web + API",
      ],
      stack: ["React Native", "React", "Node.js", "TypeScript"],
    },
    {
      id: "umode",
      name: "Plataforma uMode",
      description:
        "Módulos CRUD full-stack e modernização de grids de dados para plataforma de gestão de moda/produtos. Otimizei queries SQL de exportação com ~47k linhas, reduzindo o tempo de execução em ~80%.",
      highlights: ["80% de otimização em queries", "Grids avançados", "Modernização de legado"],
      stack: ["NestJS", "TypeScript", "React", "MongoDB", "MySQL", "AWS"],
    },
  ],
  experience: [
    {
      company: "uMode",
      role: "Engenheiro de Software",
      period: "Abr 2026 – Atual",
      stack: "NestJS, TypeScript, React, MongoDB, MySQL, AWS",
      bullets: [
        "Otimizei queries SQL de exportação (~47k linhas), reduzindo tempo de execução em ~80%",
        "Projetei módulos CRUD full-stack para materiais, fornecedores, cores, medidas e coleções",
        "Liderando modernização da plataforma: tabelas legadas → grids avançados com filtros, ordenação e gestão de registros",
      ],
    },
    {
      company: "Unnichat",
      role: "Engenheiro de Software",
      period: "Abr 2025 – Fev 2026",
      stack: "Node.js, TypeScript, React, TailwindCSS, PostgreSQL, Firebase, Docker",
      bullets: [
        "Redesenhei o dashboard principal usado por mais de 1.600 usuários ativos mensais",
        "Construí analytics que processam milhares de eventos de mensagens com insights em tempo real",
        "Implementei sistema de permissões granular para escalabilidade e segurança",
      ],
    },
    {
      company: "Governança Brasil",
      role: "Engenheiro de Software",
      period: "Fev 2023 – Jun 2024",
      stack: "Visual Basic, .NET, MySQL, Azure DevOps",
      bullets: [
        "Sistemas adotados por mais de 600 municípios e 45.000+ usuários",
        "Desenvolvi módulos de compras e patrimônio integrados com mais de 20 sistemas",
      ],
    },
    {
      company: "IPM Sistemas",
      role: "Engenheiro de Software",
      period: "Mar 2019 – Fev 2023",
      stack: "PHP, PostgreSQL, SVN, jQuery",
      bullets: [
        "Sistemas públicos adotados por mais de 850 municípios, atendendo 30M de cidadãos e 200M+ interações anuais",
        "Entreguei soluções de licitações que geraram mais de R$ 8 bilhões em economia municipal",
        "Mentorei desenvolvedores juniores e apoiei decisões de arquitetura",
      ],
    },
  ],
  skills: [
    { title: "Frontend", items: ["React", "Next.js", "TypeScript", "TailwindCSS", "React Native"] },
    { title: "Backend", items: ["Node.js", "NestJS", "Python", "PHP", ".NET"] },
    { title: "Banco de dados", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma"] },
    { title: "Cloud & DevOps", items: ["AWS", "Docker", "Firebase", "Azure DevOps"] },
    { title: "IA/ML", items: ["LangChain", "pgVector", "RAG"] },
  ],
  scheduling: {
    intro:
      "Escolha um horário para conversarmos. Você recebe a confirmação por e-mail com o link da videochamada.",
    eventTitle: "Conversa com Renan",
    eventTitleTemplate: "Call com {name}",
    durationLabel: "30 minutos",
    location: "Videochamada — link enviado por e-mail.",
    timezoneLabel: "São Paulo (GMT-3)",
    workBlockTitle: "Ocupado",
  },
};
