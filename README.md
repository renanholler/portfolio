# Hollercode Showcase

Build a personal portfolio website for Renan Holler, a Full Stack Software Engineer with 7 years of experience. Domain: hollercode.dev

## Design direction

Create a dark, minimal, developer portfolio inspired by:
- brittanychiang.com (clean structure, strong typography, section-based layout)
- brodwolf.dev (professional, straightforward)
- deven-shah.com (rich project presentation, metrics, polish)

Visual style:
- Dark background (#0a0a0a or similar deep black/charcoal)
- Light text with high contrast
- One accent color only (subtle blue or teal — not purple gradients)
- Modern sans-serif for body (Inter or similar)
- Optional monospace accent for section labels (e.g. "01. About")
- Generous whitespace, max-width ~1100px for content
- Smooth scroll between sections
- Subtle fade-in on scroll for sections
- Fully responsive (mobile-first)
- Respect prefers-reduced-motion

Do NOT use generic AI portfolio clichés: no purple/pink gradients, no floating particles, no "Hello World" hero, no excessive glassmorphism.

## Site structure

### 1. Hero
- Name: Renan Holler
- Title: Full Stack Software Engineer
- Subtitle: "7 years building scalable products — from public-sector platforms serving millions of users to modern full-stack applications."
- Location: Brazil (GMT-3)
- CTAs: "Download Resume" (PDF link), GitHub, LinkedIn, Email (renan@hollercode.dev)
- Minimal hero — no large background image. Optional subtle grid or gradient noise texture.

### 2. About
Short paragraph (3-4 sentences):
Full Stack Software Engineer with 7 years of experience building scalable web applications. Strong background in software architecture, full-stack development, database optimization, and AI-assisted engineering workflows. Experienced delivering business-critical solutions across public-sector platforms serving millions of users and fast-paced startup environments. Currently pursuing an MBA in Software Engineering with AI.

Include a small highlight row with 3 stats:
- 7+ Years of Experience
- 30M+ Users Impacted (public sector)
- 1,600+ Monthly Active Users (latest product)

### 3. Projects — MAIN FEATURE (Apple-style accordion)

This is the centerpiece of the site. Implement an interactive project selector inspired by Apple's MacBook Pro configurator (apple.com/macbook-pro buy page):

Behavior:
- Horizontal row of project pills/tabs at the top (desktop) or vertical accordion (mobile)
- One project is selected/expanded at a time
- When clicking a project pill:
  - The selected project EXPANDS showing: title, description (2-3 lines), key metrics/highlights, tech stack tags, and action links (GitHub, Live demo, LinkedIn)
  - All other projects SHRINK to compact pills showing only the project name
  - A project screenshot/mockup IMAGE appears on the right side (desktop) or below (mobile) with a smooth crossfade/slide transition
- Use smooth layout animations (height transitions, opacity, spring easing)
- Default selected project: Unnichat Dashboard

Projects to include (in this order):

1. **Unnichat Dashboard**
   - Description: Full redesign of the main dashboard for Unnichat, a messaging platform with 1,600+ monthly active users. Improved metrics visualization, performance optimization, and responsive design across devices.
   - Highlights: 1,600+ MAU · Full-stack redesign · Query optimization · Responsive
   - Stack: React, TypeScript, Node.js, PostgreSQL, TailwindCSS, Docker
   - Links: LinkedIn post (placeholder #)
   - Image: placeholder dashboard screenshot

2. **Inventory Dashboard (Almoxarifado)**
   - Description: Full-stack inventory management dashboard built for a small business. Features item management, stock in/out tracking, low-stock and expiration alerts, history, and CSV/PDF exports.
   - Highlights: Authenticated SPA · Shared validation · Edge JWT auth · Single repo deployment
   - Stack: Next.js, TypeScript, Prisma, PostgreSQL, Supabase, Zod, React Hook Form, TanStack Table, shadcn/ui, Tailwind
   - Links: GitHub (placeholder #), Live demo (placeholder #)
   - Image: placeholder dashboard screenshot

3. **fincheck**
   - Description: Personal finance management app to track accounts, expenses, income, and investments. Built with a modern full-stack TypeScript architecture.
   - Highlights: Multi-account tracking · Expense categorization · Investment monitoring
   - Stack: TypeScript, React, Node.js, PostgreSQL
   - Links: GitHub (placeholder #)
   - Image: placeholder app screenshot

4. **WaiterApp**
   - Description: Restaurant order management system with a mobile interface for waiters, a web dashboard for the kitchen, and a REST API connecting both.
   - Highlights: Multi-surface architecture · Real-time order flow · Mobile + Web + API
   - Stack: React Native, React, Node.js, TypeScript
   - Links: GitHub (placeholder #)
   - Image: placeholder mobile + web screenshot

5. **uMode Platform**
   - Description: Full-stack CRUD modules and data grid modernization for a fashion/product management platform. Optimized SQL export queries processing ~47k rows, reducing execution time by ~80%.
   - Highlights: 80% query optimization · Advanced data grids · Legacy modernization
   - Stack: NestJS, TypeScript, React, MongoDB, MySQL, AWS
   - Links: (no public link — work project)
   - Image: placeholder data grid screenshot

Use placeholder images with a subtle gradient and the project name for now. I will replace them later with real screenshots.

### 4. Experience
Vertical timeline, most recent first:

- **uMode** — Software Engineer · Apr 2026 – Present
  NestJS, TypeScript, React, MongoDB, MySQL, AWS
  • Optimized SQL export queries (~47k rows), reducing execution time by ~80%
  • Designed full-stack CRUD modules for materials, suppliers, colors, measurements, collections
  • Leading platform modernization: legacy tables → advanced data grids with filtering, sorting, record management

- **Unnichat** — Software Engineer · Apr 2025 – Feb 2026
  Node.js, TypeScript, React, TailwindCSS, PostgreSQL, Firebase, Docker
  • Redesigned main dashboard used by 1,600+ monthly active users
  • Built analytics processing thousands of messaging events with real-time insights
  • Implemented granular permissions system for scalability and security

- **Governança Brasil** — Software Engineer · Feb 2023 – Jun 2024
  Visual Basic, .NET, MySQL, Azure DevOps
  • Systems adopted by 600+ municipalities and 45,000+ users
  • Developed procurement and asset modules integrated with 20+ systems

- **IPM Sistemas** — Software Engineer · Mar 2019 – Feb 2023
  PHP, PostgreSQL, SVN, jQuery
  • Public systems adopted by 850+ municipalities, serving 30M citizens, 200M+ annual interactions
  • Delivered procurement solutions enabling over R$8 billion in municipal savings
  • Mentored junior developers and supported architectural decisions

### 5. Skills
Simple categorized grid (NOT another accordion — keep it clean):

- **Frontend:** React, Next.js, TypeScript, TailwindCSS, React Native
- **Backend:** Node.js, NestJS, Python, PHP, .NET
- **Database:** PostgreSQL, MySQL, MongoDB, Redis, Prisma
- **Cloud & DevOps:** AWS, Docker, Firebase, Azure DevOps
- **AI/ML:** LangChain, pgVector, AI-assisted development workflows

### 6. Contact / Footer
- Email: renan@hollercode.dev
- GitHub, LinkedIn links
- Simple message: "Open to opportunities — let's connect."
- Footer: "Built by Renan Holler · © 2026"

## Navigation
Fixed top nav or side nav (like brittanychiang.com) with smooth scroll to sections:
About · Projects · Experience · Skills · Contact

On mobile: hamburger menu.

## Technical requirements
- React + TypeScript + Tailwind CSS
- Framer Motion for the project accordion animations (layout animations, AnimatePresence, spring transitions)
- Single page application with smooth scroll
- Semantic HTML, accessible (keyboard navigation for project pills, aria-selected, focus states)
- SEO: proper meta tags, Open Graph for hollercode.dev
- Performance: lazy load project images, no heavy dependencies

## Animation details for the Projects accordion
- Pills: rounded-full or rounded-lg, subtle border, accent color on selected
- Expand/collapse: use Framer Motion `layout` prop for smooth height/width transitions
- Image transition: crossfade with slight scale (0.95 → 1.0) on enter
- Timing: ~400ms spring animation, not linear
- On mobile: stack vertically, image below expanded content
- Keyboard: arrow keys to navigate between projects, Enter to select

Start with the full page structure and implement the Projects accordion as the priority feature. Use placeholder content where needed — I will provide real screenshots and links later.

## Development

```sh
pnpm install
pnpm dev
```
