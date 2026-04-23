import {setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Hero} from '@/components/Hero';
import {Thesis} from '@/components/Thesis';
import {Positioning} from '@/components/Positioning';
import {Strategies} from '@/components/Strategies';
import {Financials} from '@/components/Financials';
import {Timeline} from '@/components/Timeline';
import {Team} from '@/components/Team';
import {CTA} from '@/components/CTA';
import {Footer} from '@/components/Footer';

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
        <Hero />
        <Thesis />
        <Positioning />
        <Strategies />
        <Financials />
        <Timeline />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
