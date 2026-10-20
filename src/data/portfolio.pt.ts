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
      role: "Engenheiro de Software Pleno/Sênior",
      period: "Abr 2026 – Atual",
      stack: "NestJS, TypeScript, React, MongoDB, MySQL, AWS",
      bullets: [
        "Otimizei consultas de exportação SQL (~47 mil linhas), reduzindo o tempo de execução em ~80% com pivot/CTE no MySQL.",
        "Construí de ponta a ponta um módulo de analytics de acesso e uso (NestJS, MongoDB, React): logins, entrega de e-mails via webhooks do AWS SES/SNS, adoção de funcionalidades por parceiro, agregações diárias e relatórios por tenant em CSV/PDF.",
        "Desenvolvi módulos CRUD full stack (NestJS e React) para materiais, fornecedores, cores, medidas e coleções.",
        "Lidero a modernização da gestão de dados: data grids escaláveis com filtros e ordenação no lugar de tabelas legadas.",
      ],
    },
    {
      company: "Unnichat",
      role: "Engenheiro de Software Pleno",
      period: "Abr 2025 – Fev 2026",
      stack: "Node.js, TypeScript, React, TailwindCSS, PostgreSQL, Firebase, Docker",
      bullets: [
        "Projetei o painel principal, com gráficos e gastos diários da Meta API, usado por 1.600+ usuários ativos/mês (picos de 2.000+).",
        "Desenvolvi análises e relatórios em tempo real sobre milhares de eventos de mensagens, mantendo a experiência fluida.",
        "Converti webhooks em automações e criei filtros de contatos, importação/duplicação de webhooks e permissões granulares.",
      ],
    },
    {
      company: "Comunix",
      role: "Engenheiro de Software Pleno",
      period: "Nov 2024 – Fev 2025",
      stack: "React Native, Node.js, PostgreSQL",
      bullets: [
        "Aprimorei os módulos de Recrutamento e Treinamento, otimizando processos de RH e a experiência do usuário.",
        "Desenvolvi aplicativos mobile em React Native com acesso às funcionalidades de RH em diferentes dispositivos.",
      ],
    },
    {
      company: "Governança Brasil",
      role: "Analista de Sistemas Pleno",
      period: "Fev 2023 – Jun 2024",
      stack: "Visual Basic, .NET, C#, SQL Server, Azure DevOps",
      bullets: [
        "Contribuí para sistemas adotados por mais de 600 municípios e 45 mil usuários.",
        "Desenvolvi módulos de compras e patrimônio integrados a 20+ sistemas e integrei o ERP às propostas de fornecedores.",
        "Projetei uma funcionalidade para clientes referenciarem e herdarem itens de processos licitatórios.",
      ],
    },
    {
      company: "IPM Sistemas",
      role: "Desenvolvedor Júnior → Pleno → Sênior · Analista de Sistemas",
      period: "Mar 2019 – Fev 2023",
      stack: "PHP, PostgreSQL, SVN, jQuery",
      bullets: [
        "Atuei no ERP público da IPM, plataforma usada por mais de 850 municípios, 30 milhões de cidadãos e 200M+ interações/ano.",
        "Desenvolvi recursos de compras e patrimônio (automação e assinatura digital) da plataforma, que gerou mais de R$ 8 bilhões em economia aos municípios.",
        "Integrei o ERP à API REST do Tribunal de Contas do Estado para envio de dados.",
        "Mentorei desenvolvedores juniores e apoiei decisões de arquitetura.",
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
