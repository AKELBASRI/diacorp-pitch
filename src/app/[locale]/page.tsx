import {setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {HomeHero} from '@/components/home/HomeHero';
import {Activities} from '@/components/home/Activities';
import {Projects} from '@/components/home/Projects';
import {Partners} from '@/components/home/Partners';
import {LOISection} from '@/components/home/LOISection';
import {Team} from '@/components/Team';
import {HomeContact} from '@/components/home/HomeContact';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <HomeHero />
        <Activities />
        <Projects />
        <Partners />
        <LOISection />
        <Team />
        <HomeContact />
      </main>
      <Footer />
    </>
  );
}
