import {setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {HomeHero} from '@/components/home/HomeHero';
import {ImpactStrip} from '@/components/home/ImpactStrip';
import {Activities} from '@/components/home/Activities';
import {Services} from '@/components/home/Services';
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
        <ImpactStrip />
        <Activities />
        <Projects />
        <Services />
        <Partners />
        <LOISection />
        <Team />
        <HomeContact />
      </main>
      <Footer />
    </>
  );
}
