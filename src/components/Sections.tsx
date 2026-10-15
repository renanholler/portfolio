import { HeroActions } from "@/components/HeroActions";
import { HorizontalScroll, ScrollSlide } from "@/components/HorizontalScroll";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { getPortfolio } from "@/data/get-portfolio";
import { type Locale } from "@/i18n/routing";
import { MapPin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      id="top"
      className="tile-light flex min-h-[calc(100svh-3.25rem)] flex-col justify-center px-5 pt-16 pb-14 desktop:min-h-svh desktop:px-6 desktop:pt-13 desktop:pb-20"
    >
      <div className="content-text flex flex-col items-center gap-10 desktop:flex-row desktop:items-center">
        <div className="min-w-0 w-full">
          <Reveal delay={0.05}>
            <h1 className="font-display text-[32px] leading-[1.07] font-semibold tracking-[-0.28px] desktop:text-hero-display">
              Renan Holler
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-2 font-display text-[21px] leading-[1.19] font-normal tracking-[0.231px] desktop:mt-3 desktop:text-lead">
              {t("role")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-body leading-[1.53] text-foreground desktop:mt-6 desktop:leading-[1.47]">
              {t("bio")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 inline-flex items-center gap-2 text-fine-print text-muted-foreground">
              <MapPin className="size-3.5" /> {t("location")}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <HeroActions />
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="w-full max-w-56 shrink-0 desktop:max-w-80"
        >
          <div className="product-shadow relative aspect-3/4 overflow-hidden rounded-sm">
            <Image
              src="/renan.jpeg"
              alt="Renan Holler"
              fill
              priority
              sizes="(min-width: 736px) 20rem, 80vw"
              className="object-cover object-[center_22%]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TechTags({ items }: { items: string[] }) {
  return (
    <ul className="no-scrollbar mt-3 flex gap-2 pb-0.5 mobile:overflow-x-auto desktop:flex-wrap">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pearl px-3 py-2 text-caption text-ink-muted"
        >
          <TechIcon name={item} className="size-4" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function JobHighlights({ items }: { items: string[] }) {
  return (
    <ul className="list-highlights" role="list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SkillGroups({
  skills,
  prevLabel,
  nextLabel,
}: {
  skills: ReturnType<typeof getPortfolio>["skills"];
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="mt-6 overflow-visible desktop:mt-8">
      <HorizontalScroll desktopScroll bleed={false} prevLabel={prevLabel} nextLabel={nextLabel}>
        {skills.map((group) => (
          <ScrollSlide key={group.title} desktopScroll>
            <div className="h-full w-full rounded-lg border border-hairline bg-card">
              <div className="px-4 pt-4 pb-2">
                <h4 className="text-[13px] leading-[1.23] font-normal tracking-[-0.08px] text-muted-foreground">
                  {group.title}
                </h4>
              </div>
              <ul>
                {group.items.map((item, j) => (
                  <li key={item} className={j > 0 ? "border-t border-hairline" : undefined}>
                    <div className="flex min-h-11 items-center gap-3 px-4 py-2.5">
                      <TechIcon name={item} className="size-5.5 shrink-0" />
                      <span className="min-w-0 text-body text-foreground">
                        {item}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollSlide>
        ))}
      </HorizontalScroll>
    </div>
  );
}

export async function About() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("about");
  const { skills } = getPortfolio(locale);

  const stats = [
    { value: t("stats.yearsValue"), label: t("stats.years") },
    { value: t("stats.focusValue"), label: t("stats.focus") },
    { value: t("stats.mbaValue"), label: t("stats.mba") },
  ];

  return (
    <section
      aria-labelledby="about"
      className="tile-parchment overflow-visible px-5 py-12 desktop:px-6 desktop:py-24"
    >
      <div className="content-text overflow-visible">
        <Reveal>
          <SectionHeading id="about" title={t("title")} />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="max-w-3xl text-body text-foreground">
            {t("bio")}
          </p>
        </Reveal>
        <HorizontalScroll className="mt-10 desktop:mt-12 desktop:grid desktop:grid-cols-3 desktop:gap-6">
          {stats.map((s, i) => (
            <ScrollSlide key={s.label} width="sm">
              <Reveal delay={0.05 * i}>
                <div className="card-utility h-full">
                  <p className="text-lead font-semibold tracking-tight">
                    {s.value}
                  </p>
                  <p className="mt-2 text-caption text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            </ScrollSlide>
          ))}
        </HorizontalScroll>
        <div className="mt-12 overflow-visible border-t border-hairline pt-12 desktop:mt-16 desktop:pt-16">
          <Reveal delay={0.1}>
            <h3
              id="skills"
              className="text-tagline"
            >
              {t("skillsTitle")}
            </h3>
          </Reveal>
          <SkillGroups
            skills={skills}
            prevLabel={t("skillsPrev")}
            nextLabel={t("skillsNext")}
          />
        </div>
      </div>
    </section>
  );
}

export async function Experience() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("experience");
  const { experience } = getPortfolio(locale);

  return (
    <section
      aria-labelledby="experience"
      className="tile-light px-5 py-12 desktop:px-6 desktop:py-24"
    >
      <div className="content-text">
        <Reveal>
          <SectionHeading id="experience" title={t("title")} />
        </Reveal>
        <HorizontalScroll className="desktop:hidden">
          {experience.map((job, i) => (
            <ScrollSlide key={job.company} width="lg">
              <Reveal delay={0.05 * i}>
                <article className="h-full rounded-lg border border-hairline bg-card px-5 py-6">
                  <p className="text-[13px] leading-[1.23] tracking-[-0.08px] text-muted-foreground">
                    {job.period}
                  </p>
                  <h3 className="mt-2 text-tagline">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-body text-ink-muted">
                    {job.company}
                  </p>
                  <TechTags items={job.stack.split(",").map((s) => s.trim())} />
                  <JobHighlights items={job.bullets} />
                </article>
              </Reveal>
            </ScrollSlide>
          ))}
        </HorizontalScroll>

        <ol className="hidden desktop:block desktop:border-y desktop:border-hairline">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={0.05 * i}>
              <li className="border-t border-hairline px-1 py-10 first:border-t-0 desktop:py-12">
                <p className="text-[13px] leading-[1.23] tracking-[-0.08px] text-muted-foreground">
                  {job.period}
                </p>
                <h3 className="mt-2 text-tagline">
                  {job.role}
                </h3>
                <p className="mt-1 text-body text-ink-muted">
                  {job.company}
                </p>
                <TechTags items={job.stack.split(",").map((s) => s.trim())} />
                <JobHighlights items={job.bullets} />
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
