import { HeroActions } from "@/components/HeroActions";
import { HorizontalScroll, ScrollSlide } from "@/components/HorizontalScroll";
import { LocaleFade, LocationLine } from "@/components/LocaleFade";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { getPortfolio } from "@/data/get-portfolio";
import { type Locale } from "@/i18n/routing";
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
            <LocaleFade
              as="p"
              fadeKey="hero-role"
              text={t("role")}
              className="mt-2 font-display text-[21px] leading-[1.19] font-normal tracking-[0.231px] desktop:mt-3 desktop:text-lead"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <LocaleFade
              as="p"
              fadeKey="hero-bio"
              text={t("bio")}
              className="mt-5 max-w-2xl text-body leading-[1.53] text-foreground desktop:mt-6 desktop:leading-[1.47]"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <LocationLine text={t("location")} />
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

function JobHighlights({ items, fadeKeyPrefix }: { items: string[]; fadeKeyPrefix: string }) {
  return (
    <ul className="list-highlights" role="list">
      {items.map((item, index) => (
        <li key={index}>
          <LocaleFade block fadeKey={`${fadeKeyPrefix}-${index}`} text={item} />
        </li>
      ))}
    </ul>
  );
}

function ExperienceCopy({
  job,
  scope,
}: {
  job: ReturnType<typeof getPortfolio>["experience"][number];
  scope: "mobile" | "desktop";
}) {
  return (
    <>
      <LocaleFade
        as="p"
        fadeKey={`exp-${scope}-${job.company}-period`}
        text={job.period}
        className="text-[13px] leading-[1.23] tracking-[-0.08px] text-muted-foreground"
      />
      <LocaleFade
        as="h3"
        fadeKey={`exp-${scope}-${job.company}-role`}
        text={job.role}
        className="mt-2 text-tagline"
      />
      <LocaleFade
        as="p"
        fadeKey={`exp-${scope}-${job.company}-company`}
        text={job.company}
        className="mt-1 text-body text-ink-muted"
      />
      <TechTags items={job.stack.split(",").map((s) => s.trim())} />
      <JobHighlights items={job.bullets} fadeKeyPrefix={`exp-${scope}-${job.company}-bullet`} />
    </>
  );
}

function skillGroupLabelId(title: string) {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `skill-group-${slug}`;
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
        {skills.map((group, index) => {
          const labelId = skillGroupLabelId(group.title);
          return (
            <ScrollSlide key={group.title} desktopScroll className="flex flex-col">
              <div className="w-full flex-1 rounded-lg border border-hairline bg-card">
                <ul aria-labelledby={labelId}>
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
              <p id={labelId} className="mt-2 text-caption text-muted-foreground">
                <LocaleFade fadeKey={`skill-caption-${index}`} text={group.title} />
              </p>
            </ScrollSlide>
          );
        })}
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
          <LocaleFade
            as="p"
            fadeKey="about-bio"
            text={t("bio")}
            className="max-w-3xl text-body text-foreground"
          />
        </Reveal>
        <HorizontalScroll className="mt-10 desktop:mt-12 desktop:grid desktop:grid-cols-3 desktop:gap-6">
          {stats.map((s, i) => (
            <ScrollSlide key={s.label} width="sm">
              <Reveal delay={0.05 * i}>
                <div className="card-utility h-full">
                  <LocaleFade
                    as="p"
                    fadeKey={`about-stat-${i}-value`}
                    text={s.value}
                    className="text-lead font-semibold tracking-tight"
                  />
                  <LocaleFade
                    as="p"
                    fadeKey={`about-stat-${i}-label`}
                    text={s.label}
                    className="mt-2 text-caption text-muted-foreground"
                  />
                </div>
              </Reveal>
            </ScrollSlide>
          ))}
        </HorizontalScroll>
        <div className="mt-12 overflow-visible border-t border-hairline pt-12 desktop:mt-16 desktop:pt-16">
          <Reveal delay={0.1}>
            <LocaleFade
              as="h3"
              id="skills"
              fadeKey="skills-title"
              text={t("skillsTitle")}
              className="text-tagline"
            />
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
                  <ExperienceCopy job={job} scope="mobile" />
                </article>
              </Reveal>
            </ScrollSlide>
          ))}
        </HorizontalScroll>

        <ol className="hidden desktop:block">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={0.05 * i}>
              <li className="border-t border-hairline px-1 py-10 first:border-t-0 desktop:py-12">
                <ExperienceCopy job={job} scope="desktop" />
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
