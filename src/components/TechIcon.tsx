import {
  siReact,
  siTypescript,
  siNodedotjs,
  siPostgresql,
  siTailwindcss,
  siDocker,
  siNextdotjs,
  siPrisma,
  siSupabase,
  siZod,
  siReacthookform,
  siShadcnui,
  siPython,
  siLangchain,
  siNestjs,
  siMongodb,
  siMysql,
  siPhp,
  siDotnet,
  siRedis,
  siFirebase,
  siJquery,
  siTanstack,
  siGithub,
  type SimpleIcon,
} from "simple-icons";
import { Cloud, Cpu, GitBranch, Layers, Sparkles, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const brand: Record<string, SimpleIcon> = {
  react: siReact,
  "react native": siReact,
  typescript: siTypescript,
  javascript: siTypescript,
  "node.js": siNodedotjs,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  tailwindcss: siTailwindcss,
  tailwind: siTailwindcss,
  docker: siDocker,
  "next.js": siNextdotjs,
  prisma: siPrisma,
  supabase: siSupabase,
  zod: siZod,
  "react hook form": siReacthookform,
  "shadcn/ui": siShadcnui,
  python: siPython,
  langchain: siLangchain,
  nestjs: siNestjs,
  mongodb: siMongodb,
  mysql: siMysql,
  php: siPhp,
  ".net": siDotnet,
  "visual basic": siDotnet,
  redis: siRedis,
  firebase: siFirebase,
  jquery: siJquery,
  "tanstack table": siTanstack,
  github: siGithub,
  pgvector: siPostgresql,
};

const fallback: Record<string, LucideIcon> = {
  aws: Cloud,
  "azure devops": Cloud,
  svn: GitBranch,
  "live demo": Sparkles,
  "linkedin post": Sparkles,
  "ai-assisted development workflows": Sparkles,
};

function isTooDark(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.22;
}

export function TechIcon({ name, className = "size-3.5" }: { name: string; className?: string }) {
  const key = name.trim().toLowerCase();
  const icon = brand[key];

  if (icon) {
    return (
      <svg
        role="img"
        aria-hidden
        viewBox="0 0 24 24"
        className={className}
        fill={isTooDark(icon.hex) ? "currentColor" : `#${icon.hex}`}
        style={{ flexShrink: 0 }}
      >
        <path d={icon.path} />
      </svg>
    );
  }


  const Fallback = fallback[key] ?? pickGeneric(key);
  return <Fallback className={className} aria-hidden />;
}

function pickGeneric(key: string): LucideIcon {
  if (key.includes("cloud") || key.includes("aws") || key.includes("azure")) return Cloud;
  if (key.includes("ai") || key.includes("vector")) return Cpu;
  if (key.includes("ui") || key.includes("design")) return Layers;
  return Terminal;
}
