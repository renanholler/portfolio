import { Contact } from "@/components/Contact";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { About, Experience, Hero } from "@/components/Sections";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
